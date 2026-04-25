//=============================================================================
// MultiplayerSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v5.0.0 - Central-Server Multiplayer with Party System.
 * @author Omni-Lex (Reworked for Central Server Architecture & Party System)
 * @help
 * This plugin enables a 50-player, central-server multiplayer experience
 * for RPG Maker MZ, now with a full party system.
 *
 * --- WHAT'S NEW (v5.0.0) ---
 * - PARTY SYSTEM: Players can now form parties of up to 4 members.
 * - INVITE & JOIN: Send party invitations to other players through a new menu.
 * - PARTY HUD: The on-map player list now shows your party members, regardless
 * of which map they are on.
 * - GROUP TELEPORT: When the party leader changes maps, all members are
 * automatically teleported to the leader's new location.
 * - NEW MENU: A "Party" option in the main menu opens a management screen.
 *
 * --- ARCHITECTURE ---
 * This plugin uses a pure client-server model. All communication is sent
 * to a single, authoritative WebSocket server. The server maintains the world
 * state (player positions, switches, variables, and party information) and
 * broadcasts updates to all connected players.
 *
 * --- SETUP ---
 * 1. Create events named "Player1" through "Player50" on your maps. These
 * are used as templates for player sprites.
 * 2. You will need a custom WebSocket server built to handle the logic
 * described in this plugin.
 *
 * --- SERVER-SIDE EXPECTATIONS (v5.0.0) ---
 * The server must handle the original message types ('login', 'player-move', etc.)
 * AND the new party-related messages:
 *
 * - CLIENT SENDS:
 * - 'party-invite' { targetId }: Client requests to invite another player.
 * - 'party-accept' { inviterId }: Client accepts an invitation.
 * - 'party-leave': Client leaves their current party.
 *
 * - SERVER SENDS:
 * - 'party-invite-request' { fromId, fromName }: Sent to a player who has
 * been invited to a party.
 * - 'party-update' { party: { leaderId, members: [...] } }: Broadcast to all
 * party members when the party's state changes (join, leave).
 * - 'party-disband': Sent to all members when a party is disbanded.
 * - 'force-teleport' { mapId, x, y, direction }: Sent to party members when
 * the leader transfers maps, instructing them to follow.
 *
 * The server is responsible for all party logic: creating parties, adding/removing
 * members, handling size limits (max 4), and determining the new leader if the
 * original one leaves.
 *
 * @param serverUrl
 * @text Server URL
 * @desc The WebSocket URL for the central game server.
 * @default https://hypernet-explorer-signaling-server.onrender.com
 *
 * @param maxPlayers
 * @text Maximum Players
 * @desc Maximum number of players allowed on the server.
 * @type number
 * @min 2
 * @max 50
 * @default 50
 *
 * @param excludedSwitches
 * @text Excluded Switches
 * @desc Comma-separated list of Switch IDs to NOT synchronize.
 * @type string
 * @default
 *
 * @param excludedVariables
 * @text Excluded Variables
 * @desc Comma-separated list of Variable IDs to NOT synchronize.
 * @type string
 * @default
 *
 * @param showPlayerNames
 * @text Show Player Names
 * @desc Show player display names above their character sprites.
 * @type boolean
 * @default true
 *
 * @param nameplateConfig
 * @text Nameplate Config
 * @type struct<Nameplate>
 * @default {"fontFace":"GameFont","fontSize":"18","textColor":"#FFFFFF","outlineColor":"rgba(0, 0, 0, 0.7)","outlineWidth":"3","yOffset":"-50"}
 *
 */

/*~struct~Nameplate:
 * @param fontFace
 * @text Font Face
 * @default GameFont
 *
 * @param fontSize
 * @text Font Size
 * @type number
 * @min 1
 * @default 18
 *
 * @param textColor
 * @text Text Color
 * @default #FFFFFF
 *
 * @param outlineColor
 * @text Outline Color
 * @default rgba(0, 0, 0, 0.7)
 *
 * @param outlineWidth
 * @text Outline Width
 * @type number
 * @min 0
 * @default 3
 *
 * @param yOffset
 * @text Y Offset
 * @desc Vertical offset of the name from the character's head.
 * @type number
 * @default -50
 * @min -100
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'MultiplayerSystem';
    const params = PluginManager.parameters(PLUGIN_NAME);

    const ServerUrl = params.serverUrl || 'https://hypernet-explorer-signaling-server.onrender.com';
    const MaxPlayers = Number(params.maxPlayers || 50);
    const ExcludedSwitches = (params.excludedSwitches || '').split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    const ExcludedVariables = (params.excludedVariables || '').split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    const ShowPlayerNames = params.showPlayerNames === 'true';
    const NameplateConfig = JSON.parse(params.nameplateConfig || '{}');

    //=============================================================================
    // OfflineStateManager - Manages offline state preservation
    //=============================================================================
    class OfflineStateManager {
        constructor() {
            this.savedState = null;
        }

        saveCurrentState() {
            this.savedState = {
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                direction: $gamePlayer.direction(),
                switches: this.captureAllSwitches(),
                variables: this.captureAllVariables()
            };
            console.log('Saved offline state.');
            return this.savedState;
        }

        captureAllSwitches() {
            const switches = {};
            for (let i = 1; i < $dataSystem.switches.length; i++) {
                switches[i] = $gameSwitches.value(i);
            }
            return switches;
        }

        captureAllVariables() {
            const variables = {};
            for (let i = 1; i < $dataSystem.variables.length; i++) {
                variables[i] = $gameVariables.value(i);
            }
            return variables;
        }

        restoreState(restorePosition = true) {
            if (!this.savedState) {
                console.warn('No saved state to restore');
                return false;
            }

            // Restore switches
            for (const id in this.savedState.switches) {
                $gameSwitches.setValue(Number(id), this.savedState.switches[id], true);
            }

            // Restore variables
            for (const id in this.savedState.variables) {
                $gameVariables.setValue(Number(id), this.savedState.variables[id], true);
            }
            
            // Restore position
            if (restorePosition) {
                if ($gameMap.mapId() !== this.savedState.mapId) {
                    $gamePlayer.reserveTransfer(
                        this.savedState.mapId,
                        this.savedState.x,
                        this.savedState.y,
                        this.savedState.direction,
                        0
                    );
                } else {
                    $gamePlayer.locate(this.savedState.x, this.savedState.y);
                    $gamePlayer.setDirection(this.savedState.direction);
                }
            }

            console.log('Restored offline state.');
            this.clearState();
            return true;
        }

        clearState() {
            this.savedState = null;
        }
    }

    //=============================================================================
    // NetworkManager - Reworked for Central Server Architecture
    //=============================================================================
    class NetworkManager {
        constructor() {
            this.ws = null;
            this.myId = null;
            this.players = new Map();
            this.party = null; // NEW: Party state object
            this.currentServerUrl = '';
            this.lastPlayerState = {};
            this.offlineStateManager = new OfflineStateManager();
            this._reconnectAttempt = false;
            this._reconnectTimer = null;
        }

        static get instance() {
            if (!this._instance) {
                this._instance = new NetworkManager();
            }
            return this._instance;
        }
        
        static refreshPlayerListUI() {
            const scene = SceneManager._scene;
            if (scene instanceof Scene_Map && scene._playerListWindow) {
                scene._playerListWindow.refresh();
            }
        }

        isConnected() {
            return this.ws && this.ws.readyState === WebSocket.OPEN;
        }

        isMultiplayer() {
            return !!this.myId;
        }

        isInParty() {
            return !!this.party;
        }

        isConnecting() {
            return this.ws && this.ws.readyState === WebSocket.CONNECTING;
        }
        
        connect(serverUrl) {
            return new Promise((resolve, reject) => {
                this.offlineStateManager.saveCurrentState();

                if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
                    this.ws.close();
                }

                this.currentServerUrl = serverUrl;
                this.ws = new WebSocket(serverUrl);
                NetworkManager.updateUI("Connecting to server...", false);

                this.ws.onopen = () => {
                    console.log('Connected to server.');
                    this.send({
                        type: 'login',
                        playerInfo: this.createPlayerInfo()
                    });
                    resolve();
                };

                this.ws.onmessage = (message) => {
                    const data = JSON.parse(message.data);
                    this.handleServerMessage(data);
                };

                this.ws.onerror = (error) => {
                    console.error('Server connection error:', error);
                    NetworkManager.updateUI("Failed to connect to server.", true);
                    this.handleDisconnection(true); 
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('Disconnected from server.');
                    this.handleDisconnection(true);
                };
            });
        }
        
        handleDisconnection(restoreLocalState) {
            if (restoreLocalState && this.myId) { // Only restore if was previously connected
                 this.offlineStateManager.restoreState(true);
            }
            this.cleanup();
            NetworkManager.updateUI("Disconnected.", false);
        }

        cleanup() {
            if (this.ws) {
                this.ws.onopen = null;
                this.ws.onmessage = null;
                this.ws.onerror = null;
                this.ws.onclose = null;
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                this.ws = null;
            }
            
            this.players.clear();
            MultiplayerManager.instance.clearRemotePlayers();
            NetworkManager.refreshPlayerListUI();
            
            this.myId = null;
            this.party = null;
            this.lastPlayerState = {};
            
            // Re-enable this switch for menu access
            $gameSwitches.setValue(66, false, true); 
            
            console.log('Cleaned up multiplayer session.');
        }

        disconnect(restoreState = true) {
            NetworkManager.updateUI("Disconnecting...", false);
            this.handleDisconnection(restoreState);
        }

        send(data) {
            if (this.isConnected()) {
                this.ws.send(JSON.stringify(data));
            }
        }

        static updateUI(text, isError = false) {
            const scene = SceneManager._scene;
            if (scene instanceof Scene_Multiplayer) {
                scene.updateStatus(text, isError);
            }
        }

        createPlayerInfo() {
            const leader = $gameParty.leader();
            const actor = $gameActors.actor(1);
            return {
                name: actor.name(),
                characterName: leader.characterName(),
                characterIndex: leader.characterIndex(),
                faceName: leader.faceName(),
                faceIndex: leader.faceIndex(),
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                direction: $gamePlayer.direction()
            };
        }

        handleServerMessage(data) {
            switch (data.type) {
                case 'login-success':
                    this.myId = data.yourId;
                    this.players.set(this.myId, this.createPlayerInfo()); // Add self to list
                    
                    // Apply server state
                    this.applyFullGameState(data.gameState.switches, data.gameState.variables);

                    // Load other players
                    for (const player of data.players) {
                        if (player.id !== this.myId) {
                            this.players.set(player.id, player.info);
                        }
                    }
                    
                    this.offlineStateManager.clearState(); // Server state is now truth
                    
                    const scene = SceneManager._scene;
                    if (scene instanceof Scene_Multiplayer) {
                        scene.onConnectionSuccess();
                    }
                    NetworkManager.refreshPlayerListUI();
                    break;

                case 'player-joined':
                    console.log(`Player ${data.playerId} joined.`);
                    this.players.set(data.playerId, data.playerInfo);
                    MultiplayerManager.instance.handlePlayerMapTransfer(data.playerId, data.playerInfo.mapId);
                    NetworkManager.refreshPlayerListUI();
                    break;
                    
                case 'player-left':
                    console.log(`Player ${data.playerId} left.`);
                    this.players.delete(data.playerId);
                    MultiplayerManager.instance.removeRemotePlayer(data.playerId);
                    NetworkManager.refreshPlayerListUI();
                    break;
                
                case 'player-move':
                    if (data.from !== this.myId) {
                        this.updateRemotePlayer(data.from, data);
                    }
                    break;
                
                case 'player-meta':
                     if (data.from !== this.myId) {
                        this.updatePlayerInfo(data.from, data.info);
                    }
                    break;

                case 'map-transfer':
                    if (data.from !== this.myId) {
                        const playerInfo = this.players.get(data.from);
                        if (playerInfo) {
                            playerInfo.mapId = data.mapId;
                        }
                        MultiplayerManager.instance.handlePlayerMapTransfer(data.from, data.mapId);
                    }
                    break;

                case 'switch-change':
                    $gameSwitches.setValue(data.id, data.value, true); // fromNetwork = true
                    break;
                    
                case 'variable-change':
                    $gameVariables.setValue(data.id, data.value, true); // fromNetwork = true
                    break;
                    
                case 'player-state-change':
                     if (data.from !== this.myId) {
                        MultiplayerManager.instance.updateRemotePlayerState(data.from, data.state);
                     }
                    break;
                
                // --- NEW: Party System Messages ---
                case 'party-invite-request':
                    PartyUIManager.instance.showInvitation(data.fromId, data.fromName);
                    break;
                
                    case 'party-update':
                        this.party = data.party;
                        console.log("Party state updated:", this.party);
                        NetworkManager.refreshPlayerListUI();
                        MultiplayerManager.instance.setupPlayerEvents();
                        
                        // ADD THESE LINES:
                        // Refresh multiplayer scene if open
                        const currentScene = SceneManager._scene;
                        if (currentScene instanceof Scene_Multiplayer) {
                            currentScene.refreshWindows();
                        }
                        break;
                    
                    case 'party-disband':
                        this.party = null;
                        console.log("Party has been disbanded.");
                        NetworkManager.refreshPlayerListUI();
                        MultiplayerManager.instance.setupPlayerEvents();
                        
                        // ADD THESE LINES:
                        // Refresh multiplayer scene if open
                        const activeScene = SceneManager._scene;
                        if (activeScene instanceof Scene_Multiplayer) {
                            activeScene.refreshWindows();
                        }
                        break;
                
                case 'force-teleport':
                    if (this.isInParty() && this.myId !== this.party.leaderId) {
                        console.log(`Following party leader to map ${data.mapId}.`);
                        $gamePlayer.reserveTransfer(data.mapId, data.x, data.y, data.direction, 2); // No fade
                    }
                    break;

                case 'error':
                    console.error('Server error:', data.message);
                    NetworkManager.updateUI(data.message, true);
                    this.disconnect(true);
                    break;
            }
        }
        
        applyFullGameState(switches, variables) {
            for(const id in switches) {
                if (!ExcludedSwitches.includes(Number(id))) {
                    $gameSwitches.setValue(Number(id), switches[id], true);
                }
            }
            for(const id in variables) {
                 if (!ExcludedVariables.includes(Number(id))) {
                    $gameVariables.setValue(Number(id), variables[id], true);
                 }
            }
            console.log("Full game state (Switches/Variables) synchronized from server.");
        }

        updateRemotePlayer(playerId, data) {
            MultiplayerManager.instance.updateRemotePlayerPosition(playerId, data);
        }

        updatePlayerInfo(playerId, info) {
            this.players.set(playerId, info);
            MultiplayerManager.instance.updateRemotePlayerGraphic(
                playerId, info.characterName, info.characterIndex
            );
            NetworkManager.refreshPlayerListUI();
        }

        onSwitchChange(switchId, value) {
            if (this.isMultiplayer() && !ExcludedSwitches.includes(switchId)) {
                this.send({ type: 'switch-change', id: switchId, value: value });
            }
        }

        onVariableChange(variableId, value) {
            if (this.isMultiplayer() && !ExcludedVariables.includes(variableId)) {
                this.send({ type: 'variable-change', id: variableId, value: value });
            }
        }
        
        // --- NEW: Party Send Methods ---
        sendPartyInvite(targetId) {
            // --- SERVER-SIDE EXPECTATIONS ---
            // The server receives 'party-invite' { targetId }.
            // It should validate (party not full, target not in party, etc.)
            // and then send 'party-invite-request' to the target client.
            this.send({ type: 'party-invite', targetId: targetId });
        }
        
        sendPartyAccept(inviterId) {
            // --- SERVER-SIDE EXPECTATIONS ---
            // The server receives 'party-accept' { inviterId }.
            // It adds this player to the inviter's party and broadcasts
            // 'party-update' to all members of that party.
            this.send({ type: 'party-accept', inviterId: inviterId });
        }
        
        sendPartyLeave() {
            // --- SERVER-SIDE EXPECTATIONS ---
            // The server receives 'party-leave'. It removes the player from
            // their party. If they were the leader, it assigns a new one or
            // disbands the party. It broadcasts 'party-update' or 'party-disband'.
            this.send({ type: 'party-leave' });
        }

        updateLocalPlayerPosition() {
            if (!this.isMultiplayer() || !$gamePlayer) return;

            const player = $gamePlayer;
            const lastState = this.lastPlayerState;

            const hasChanged =
                lastState.x !== player.x ||
                lastState.y !== player.y ||
                lastState.direction !== player.direction() ||
                lastState.pattern !== player.pattern();

            if (hasChanged) {
                const newState = {
                    x: player.x,
                    y: player.y,
                    direction: player.direction(),
                    pattern: player.pattern(),
                    moveSpeed: player.realMoveSpeed(),
                };
                
                this.send({
                    type: 'player-move',
                    ...newState
                });

                this.lastPlayerState = newState;
            }
        }

        onMapTransfer() {
            if(this.isMultiplayer()) {
                // --- SERVER-SIDE EXPECTATIONS ---
                // When the server receives 'map-transfer', it should check if the
                // sender is a party leader. If so, it must broadcast a
                // 'force-teleport' message to all other party members.
                this.send({type: 'map-transfer', mapId: $gameMap.mapId()});
                
                const myInfo = this.players.get(this.myId);
                if (myInfo) {
                    myInfo.mapId = $gameMap.mapId();
                }
            }
        }
    }
    window.NetworkManager = NetworkManager;

    //=============================================================================
    // MultiplayerManager
    //=============================================================================
    class MultiplayerManager {
        constructor() {
            this.playerEvents = new Map();
            this.eventPlayerMap = new Map();
            this.playerMovementQueue = new Map();
        }

        static get instance() {
            if (!this._instance) {
                this._instance = new MultiplayerManager();
            }
            return this._instance;
        }

        update() {
            if (NetworkManager.instance.isMultiplayer()) {
                NetworkManager.instance.updateLocalPlayerPosition();
                this.processMovementQueue();
            }
        }

        processMovementQueue() {
            for (const [playerId, movements] of this.playerMovementQueue.entries()) {
                if (movements.length === 0) continue;
                
                const event = this.getRemotePlayer(playerId);
                if (!event || event.isMoving()) continue;
                
                const nextMove = movements.shift();
                if (nextMove) {
                    this.executeMovement(event, nextMove);
                }
            }
        }
        
        executeMovement(event, moveData) {
            event.setMoveSpeed(moveData.moveSpeed);
            event.setPattern(moveData.pattern || event.pattern());
        
            const dx = moveData.x - event.x;
            const dy = moveData.y - event.y;
        
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                event.locate(moveData.x, moveData.y);
            } 
            else if (dx !== 0 || dy !== 0) {
                const sx = event.deltaXFrom(moveData.x);
                const sy = event.deltaYFrom(moveData.y);
                if (Math.abs(sx) > Math.abs(sy)) {
                    event.moveStraight(sx > 0 ? 4 : 6);
                } else if (sy !== 0) {
                    event.moveStraight(sy > 0 ? 8 : 2);
                }
            }
        
            event.setDirection(moveData.direction);
        }

        getRemotePlayer(id) {
            const eventId = this.playerEvents.get(id);
            return eventId ? $gameMap.event(eventId) : null;
        }
        
        removeRemotePlayer(id) {
            const eventId = this.playerEvents.get(id);
            if (eventId) {
                const event = $gameMap.event(eventId);
                if (event) {
                    event.setOpacity(0);
                    event._characterName = '';
                }
                this.playerEvents.delete(id);
                this.eventPlayerMap.delete(eventId);
                this.playerMovementQueue.delete(id);
            }
        }
        
        clearRemotePlayers() {
            for (const eventId of this.eventPlayerMap.keys()) {
                const event = $gameMap.event(eventId);
                if (event) {
                    event.setOpacity(0);
                    event._characterName = '';
                }
            }
            this.playerEvents.clear();
            this.eventPlayerMap.clear();
            this.playerMovementQueue.clear();
        }
        
        onMapLoaded() {
            if (NetworkManager.instance.isMultiplayer()) {
                NetworkManager.instance.onMapTransfer();
                this.setupPlayerEvents();
            }
        }

        setupPlayerEvents() {
            const MAX_MAP_SLOTS = 8;
            const playerEventNames = Array.from({length: MAX_MAP_SLOTS}, (_, i) => `Player${i + 1}`);
    
            this.playerEvents.clear();
            this.eventPlayerMap.clear();
            this.playerMovementQueue.clear();
    
            if (!$dataMap.events) return;
    
            const nm = NetworkManager.instance;
            const myId = nm.myId;
            const currentMapId = $gameMap.mapId();
    
            // Find and hide all available player template events
            const availableSlots = [];
            for (const event of $dataMap.events) {
                if (event && playerEventNames.includes(event.name)) {
                    availableSlots.push(event); // Store the full event data
                    const mapEvent = $gameMap.event(event.id);
                    if (mapEvent) {
                        mapEvent.setOpacity(0);
                        mapEvent._characterName = '';
                    }
                }
            }
            // Sort slots by name to ensure Player1 is used first, Player2 second, etc.
            availableSlots.sort((a, b) => {
                const numA = parseInt(a.name.replace('Player', ''));
                const numB = parseInt(b.name.replace('Player', ''));
                return numA - numB;
            });
    
            // --- Prioritization Logic ---
            const partyMembers = nm.isInParty() ? nm.party.members : [];
    
            const partyPlayersOnMap = [];
            const otherPlayersOnMap = [];
    
            for (const [playerId, playerInfo] of nm.players.entries()) {
                if (playerId === myId || !playerInfo || playerInfo.mapId !== currentMapId) {
                    continue;
                }
    
                const playerData = { id: playerId, info: playerInfo };
                if (partyMembers.includes(playerId)) {
                    partyPlayersOnMap.push(playerData);
                } else {
                    otherPlayersOnMap.push(playerData);
                }
            }
    
            // Combine lists, with party members first, and slice to the max slots
            const playersToDisplay = [...partyPlayersOnMap, ...otherPlayersOnMap].slice(0, MAX_MAP_SLOTS);
    
            // --- Assign players to available slots ---
            for (let i = 0; i < playersToDisplay.length; i++) {
                const player = playersToDisplay[i];
                const eventData = availableSlots[i];
    
                if (player && eventData) {
                    const playerId = player.id;
                    const playerInfo = player.info;
    
                    this.playerEvents.set(playerId, eventData.id);
                    this.eventPlayerMap.set(eventData.id, playerId);
                    this.playerMovementQueue.set(playerId, []);
    
                    const event = $gameMap.event(eventData.id);
                    if (event) {
                        event._characterName = playerInfo.characterName;
                        event._characterIndex = playerInfo.characterIndex;
                        event.locate(playerInfo.x, playerInfo.y);
                        event.setDirection(playerInfo.direction);
                        event.setOpacity(255);
                        event.refresh();
                    }
                }
            }
        }
        
        updateRemotePlayerPosition(playerId, data) {
            const playerInfo = NetworkManager.instance.players.get(playerId);
            if (playerInfo) {
                playerInfo.x = data.x;
                playerInfo.y = data.y;
                playerInfo.direction = data.direction;
            }

            const event = this.getRemotePlayer(playerId);
            if (!event) return;
            
            if (!this.playerMovementQueue.has(playerId)) {
                this.playerMovementQueue.set(playerId, []);
            }
            
            const queue = this.playerMovementQueue.get(playerId);
            const dx = Math.abs(data.x - event.x);
            const dy = Math.abs(data.y - event.y);
            
            if (dx > 3 || dy > 3 || queue.length > 8) {
                queue.length = 0;
                event.locate(data.x, data.y);
                this.executeMovement(event, data);
            } else {
                queue.push(data);
            }
        }
        
        updateRemotePlayerGraphic(playerId, characterName, characterIndex) {
            const event = this.getRemotePlayer(playerId);
            if (event) {
                event._characterName = characterName;
                event._characterIndex = characterIndex;
                event.refresh();
            }
        }
        
        handlePlayerMapTransfer(playerId, mapId) {
            const playerInfo = NetworkManager.instance.players.get(playerId);
            if (playerInfo) playerInfo.mapId = mapId;
            
            if (mapId === $gameMap.mapId()) {
                this.setupPlayerEvents(); // Re-run to show the new player
            } else {
                const event = this.getRemotePlayer(playerId);
                if (event) {
                    event.setOpacity(0);
                    event._characterName = '';
                    this.playerMovementQueue.delete(playerId);
                }
            }
        }

        updateRemotePlayerState(playerId, state) {
            const event = this.getRemotePlayer(playerId);
            if (!event) return;

            if (state === 'battling') {
                event.setOpacity(0);
            } else {
                event.setOpacity(255);
            }
        }
    }
    
    //=============================================================================
    // Scene_Multiplayer and its Windows
    //=============================================================================

// =====================================================
// SECTION 2: Replace entire Scene_Multiplayer class
// =====================================================

class Scene_Multiplayer extends Scene_MenuBase {
    create() {
        super.create();
        this._serverUrl = localStorage.getItem('gmn_mp_serverUrl') || ServerUrl;
        this.createHelpWindow();
        this.createInputWindow();
        this.createStatusWindow();
        this.createPlayerListWindow();  // NEW
        this.createPartyWindow();       // NEW
    }

    createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.setText(`Multiplayer Menu (Max ${MaxPlayers} players)`);
        this.addWindow(this._helpWindow);
    }

    helpWindowRect() {
        return new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(2, false));
    }

    createInputWindow() {
        const rect = this.inputWindowRect();
        this._inputWindow = new Window_MultiplayerInput(rect);
        this._inputWindow.setServerUrl(this._serverUrl);
        this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
        this._inputWindow.setHandler('cancel', this.popScene.bind(this));
        this._inputWindow.activate();
        this.addWindow(this._inputWindow);
    }

    inputWindowRect() {
        const wx = 0;
        const wy = this._helpWindow.y + this._helpWindow.height;
        const ww = Math.floor(Graphics.boxWidth * 0.5);  // CHANGED from 0.6
        const wh = this.calcWindowHeight(6, true);        // CHANGED from 4
        return new Rectangle(wx, wy, ww, wh);
    }

    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_MultiplayerStatus(rect);
        this.addWindow(this._statusWindow);
    }

    statusWindowRect() {
        const wx = this._inputWindow.width;
        const wy = this._inputWindow.y;
        const ww = Graphics.boxWidth - wx;
        const wh = this._inputWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    }

    // NEW METHODS:
    createPlayerListWindow() {
        const rect = this.playerListWindowRect();
        this._playerListWindow = new Window_MultiplayerPlayerList(rect);
        this._playerListWindow.setHandler('invite', this.onInvitePlayer.bind(this));
        this._playerListWindow.setHandler('cancel', this.onPlayerListCancel.bind(this));
        this._playerListWindow.deactivate();
        this._playerListWindow.hide();
        this.addWindow(this._playerListWindow);
    }

    playerListWindowRect() {
        const wx = 0;
        const wy = this._inputWindow.y + this._inputWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    }

    createPartyWindow() {
        const rect = this.partyWindowRect();
        this._partyWindow = new Window_MultiplayerParty(rect);
        this._partyWindow.setHandler('leave', this.onLeaveParty.bind(this));
        this._partyWindow.setHandler('cancel', this.onPartyCancel.bind(this));
        this._partyWindow.deactivate();
        this._partyWindow.hide();
        this.addWindow(this._partyWindow);
    }

    partyWindowRect() {
        const wx = 0;
        const wy = this._inputWindow.y + this._inputWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    }

    onInputOk() {
        this._serverUrl = this._inputWindow.serverUrl();
        localStorage.setItem('gmn_mp_serverUrl', this._serverUrl);
        const selectedAction = this._inputWindow.currentSymbol();
        
        switch(selectedAction) {
            case 'connect':
                this.commandConnect();
                break;
            case 'disconnect':
                this.commandDisconnect();
                break;
            case 'players':      // NEW
                this.commandPlayerList();
                break;
            case 'party':        // NEW
                this.commandPartyMenu();
                break;
        }
    }

    commandConnect() {
        if (!this._serverUrl) {
            SoundManager.playBuzzer();
            this.updateStatus('Server URL cannot be empty!', true);
            return;
        }
        NetworkManager.instance.connect(this._serverUrl).catch(() => {});
    }

    commandDisconnect() {
        NetworkManager.instance.disconnect(true);
        this._inputWindow.refresh();
    }

    // NEW COMMANDS:
    commandPlayerList() {
        this._inputWindow.deactivate();
        this._playerListWindow.refresh();
        this._playerListWindow.show();
        this._playerListWindow.activate();
        this._playerListWindow.select(0);
        this._helpWindow.setText("Select a player to invite to your party.");
    }

    commandPartyMenu() {
        this._inputWindow.deactivate();
        this._partyWindow.refresh();
        this._partyWindow.show();
        this._partyWindow.activate();
        this._partyWindow.select(0);
        this._helpWindow.setText("Party Management");
    }

    onInvitePlayer() {
        const player = this._playerListWindow.selectedPlayer();
        if (player) {
            NetworkManager.instance.sendPartyInvite(player.id);
            this.updateStatus(`Party invitation sent to ${player.info.name}!`);
            SoundManager.playOk();
        }
        this._playerListWindow.activate();
    }

    onPlayerListCancel() {
        this._playerListWindow.hide();
        this._playerListWindow.deactivate();
        this._inputWindow.activate();
        this._helpWindow.setText(`Multiplayer Menu (Max ${MaxPlayers} players)`);
    }

    onLeaveParty() {
        NetworkManager.instance.sendPartyLeave();
        this.updateStatus("You have left the party.");
        this._partyWindow.refresh();
    }

    onPartyCancel() {
        this._partyWindow.hide();
        this._partyWindow.deactivate();
        this._inputWindow.activate();
        this._helpWindow.setText(`Multiplayer Menu (Max ${MaxPlayers} players)`);
    }

    updateStatus(text, isError = false) {
        this._helpWindow.setText(text);
        if (isError) SoundManager.playBuzzer();
    }

    onConnectionSuccess() {
        this.updateStatus("Success! Joining game...");
        SoundManager.playOk();
        $gameSwitches.setValue(66, true, true);
        setTimeout(() => SceneManager.goto(Scene_Map), 1500);
    }

    // NEW METHOD:
    refreshWindows() {
        if (this._statusWindow) this._statusWindow.refresh();
        if (this._inputWindow) this._inputWindow.refresh();
        if (this._playerListWindow) this._playerListWindow.refresh();
        if (this._partyWindow) this._partyWindow.refresh();
    }

    update() {
        super.update();
        this.refreshWindows();  // CHANGED from individual refreshes
    }
}
    

class Window_MultiplayerInput extends Window_Selectable {
    constructor(rect) {
        super(rect);
        this._serverUrl = '';
        this.refresh();
    }
    maxItems() { return this._list ? this._list.length : 0; }
    serverUrl() { return this._serverUrl; }
    setServerUrl(url) { this._serverUrl = url || ''; this.refresh(); }
    currentSymbol() { return this._list[this.index()]?.symbol; }

    makeCommandList() {
        const connected = NetworkManager.instance.isMultiplayer();
        this._list = [];
        this._list.push({name: 'Server URL:', symbol: 'serverUrl', enabled: !connected });
        
        if (connected) {
            this._list.push({name: '► Disconnect', symbol: 'disconnect', enabled: true });
            this._list.push({name: '► Player List', symbol: 'players', enabled: true });     // NEW
            this._list.push({name: '► Party Menu', symbol: 'party', enabled: true });        // NEW
        } else {
            this._list.push({name: '► Connect', symbol: 'connect', enabled: true });
        }
    }

    drawItem(index) {
        const item = this._list[index];
        if (!item) return;

        const rect = this.itemLineRect(index);
        this.changePaintOpacity(item.enabled);
        this.resetTextColor();

        switch(item.symbol) {
            case 'serverUrl':
                this.drawText(item.name, rect.x + 4, rect.y, 150);
                this.drawText(this._serverUrl, rect.x + 154, rect.y, rect.width - 158);
                break;
            case 'connect':
            case 'disconnect':
            case 'players':      // NEW
            case 'party':        // NEW
                this.changeTextColor(this.systemColor());
                this.drawText(item.name, rect.x, rect.y, rect.width, 'center');
                break;
        }
         this.changePaintOpacity(true);
    }

    processOk() {
        const item = this._list[this.index()];
        if (!item || !item.enabled) {
            SoundManager.playBuzzer();
            return;
        }
        SoundManager.playOk();
        if (item.symbol === 'serverUrl') {
            const currentUrl = this._serverUrl || '';
            this.startTextInput('Server URL', currentUrl, (result) => {
                if (result !== null) this.setServerUrl(result);
            });
        } else {
            this.callHandler('ok');
        }
    }
    
    startTextInput(title, initialText, callback) {
        const result = prompt(title, initialText);
        callback(result);
        this.activate();
    }

    refresh() { this.makeCommandList(); super.refresh(); }
    activate() { super.activate(); this.select(0); }
}

    

class Window_MultiplayerStatus extends Window_Base {
    refresh() {
        this.contents.clear();
        const nm = NetworkManager.instance;
        this.changeTextColor(this.systemColor());
        this.drawText('Status', 0, 0, this.contentsWidth(), 'center');
        this.resetTextColor();
        let y = this.lineHeight();
        if (nm.isMultiplayer()) {
            this.drawText(`Players: ${nm.players.size}/${MaxPlayers}`, 4, y);
            y += this.lineHeight();
            this.drawText(`My ID: ${nm.myId}`, 4, y);
            y += this.lineHeight();
            // ADD THESE LINES:
            if (nm.isInParty()) {
                this.drawText(`Party: ${nm.party.members.length}/4`, 4, y);
            } else {
                this.drawText('No party', 4, y);
            }
        } else if (nm.isConnecting()) {
            this.drawText('Connecting...', 4, y);
        } else {
            this.drawText('Not connected', 4, y);
        }
    }
}
    
    //=============================================================================
    // Game Hooks & Aliases
    //=============================================================================
    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value, fromNetwork = false) {
        if (this.value(switchId) === value) return;
        _Game_Switches_setValue.call(this, switchId, value);
        if (!fromNetwork) {
            NetworkManager.instance.onSwitchChange(switchId, value);
        }
    };

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value, fromNetwork = false) {
        if (this.value(variableId) === value) return;
        _Game_Variables_setValue.call(this, variableId, value);
        if (!fromNetwork) {
            NetworkManager.instance.onVariableChange(variableId, value);
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        MultiplayerManager.instance.update();
    };

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        MultiplayerManager.instance.onMapLoaded();
    };
    
    // Prevent triggering "PlayerX" events
    const _Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
        if (!$gameMap.isEventRunning()) {
            for (const event of $gameMap.eventsXy(x, y)) {
                if (event.event().name.match(/^Player\d+$/)) {
                    continue;
                }
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    event.start();
                    return;
                }
            }
        }
    };

    // Events should not self-move on clients; server dictates positions.
    const _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement = function() {
        if (NetworkManager.instance.isMultiplayer()) {
            return;
        }
        _Game_Event_updateSelfMovement.call(this);
    };

    // Update player meta info (e.g., character graphic change)
    const _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        _Game_Player_refresh.call(this);
        if (NetworkManager.instance.isMultiplayer()) {
            const networkManager = NetworkManager.instance;
            const myId = networkManager.myId;
            if (myId) {
                const newInfo = networkManager.createPlayerInfo();
                networkManager.players.set(myId, newInfo);
                networkManager.send({ type: 'player-meta', info: newInfo });
            }
        }
    };
    
    // Broadcast battle state
    const _Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
    Game_Interpreter.prototype.command301 = function(params) {
        if (NetworkManager.instance.isMultiplayer() && !BattleManager.isBattleTest()) {
            NetworkManager.instance.send({ type: 'player-state-change', state: 'battling' });
            const originalCallback = this._branch[this._indent];
            this._branch[this._indent] = (result) => {
                NetworkManager.instance.send({ type: 'player-state-change', state: 'idle' });
                if (originalCallback) originalCallback(result);
            };
        }
        return _Game_Interpreter_command301.call(this, params);
    };

    //=============================================================================
    // PartyUIManager - Handles invitation popups
    //=============================================================================
    class PartyUIManager {
        constructor() {
            this._invitationQueue = [];
            this._currentWindow = null;
        }

        static get instance() {
            if (!this._instance) this._instance = new PartyUIManager();
            return this._instance;
        }

        showInvitation(inviterId, inviterName) {
            this._invitationQueue.push({ inviterId, inviterName });
        }

        update() {
            if (this._currentWindow && this._currentWindow.isClosed()) {
                const scene = SceneManager._scene;
                if (scene && scene._invitationWindow === this._currentWindow) {
                    scene.removeWindow(this._currentWindow);
                    scene._invitationWindow = null;
                }
                this._currentWindow = null;
            }

            if (!this._currentWindow && this._invitationQueue.length > 0) {
                const scene = SceneManager._scene;
                if (scene && scene.isReady() && !$gameMessage.isBusy() && scene.isMapScene && scene.isMapScene()) {
                    const invite = this._invitationQueue.shift();
                    this._currentWindow = new Window_PartyInvitation(new Rectangle(0, 0, 400, 120), invite);
                    this._currentWindow.x = (Graphics.boxWidth - this._currentWindow.width) / 2;
                    this._currentWindow.y = 20;
                    scene.addWindow(this._currentWindow);
                    scene._invitationWindow = this._currentWindow;
                }
            }
        }
    }
    window.PartyUIManager = PartyUIManager;

    class Window_PartyInvitation extends Window_Command {
        constructor(rect, inviteData) {
            super(rect);
            this._invite = inviteData;
            this.openness = 0;
            this.open();
            this.activate();
        }

        makeCommandList() {
            this.addCommand("Accept", "accept", true);
            this.addCommand("Decline", "decline", true);
        }

        windowWidth() { return 400; }
        
        drawItem(index) {
            if (index === 0) {
                 this.drawTextEx(`\\c[1]${this._invite.inviterName}\\c[0] has invited you to a party.`, this.itemPadding(), 0);
            }
            const rect = this.itemLineRect(index + 1);
            const symbol = this.commandSymbol(index);
            const enabled = this.isCommandEnabled(symbol);
            this.changePaintOpacity(enabled);
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'center');
        }

        itemRect(index) {
             // Offset commands to be below the text
            return super.itemRect(index + 1);
        }

        processOk() {
            const symbol = this.currentSymbol();
            if (symbol === 'accept') {
                NetworkManager.instance.sendPartyAccept(this._invite.inviterId);
            }
            SoundManager.playOk();
            this.close();
        }

        processCancel() {
            this.close();
        }
    }
    
    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        _SceneManager_updateMain.apply(this, arguments);
        if (NetworkManager.instance.isMultiplayer()) {
            PartyUIManager.instance.update();
        }
    };
    
    const _Scene_Map_isMapScene = Scene_Map.prototype.isMapScene;
    Scene_Map.prototype.isMapScene = function() {
        return _Scene_Map_isMapScene.call(this) && !this._invitationWindow;
    };


    //=============================================================================
    // Window_PlayerList (UI Element)
    //=============================================================================
    class Window_PlayerList extends Window_Base {
        constructor(rect) {
            super(rect);
            this.opacity = 0;
            this._bustSprites = [];
            this.frameVisible = false;
            this.refresh();
        }

        getBustImageForCharacter(characterName, characterIndex) {
            if (!characterName || characterName.startsWith("$") || characterName.startsWith("!") || characterName.startsWith("Objects")) {
                return null;
            }
            const spritesheetName = characterName.split('.')[0];
            return `busts/${spritesheetName}/${characterIndex}`;
        }

        refresh() {
            this.contents.clear();
            
            for (const sprite of this._bustSprites) {
                if (sprite.parent) this.removeChild(sprite);
            }
            this._bustSprites = [];
            
            const nm = NetworkManager.instance;
            if (!nm.isMultiplayer()) return;

            let playersToDisplay = [];
            if (nm.isInParty()) {
                // Party mode: show all party members
                for (const memberId of nm.party.members) {
                    const playerInfo = nm.players.get(memberId);
                    if (playerInfo) playersToDisplay.push(playerInfo);
                }
            } else {
                // Solo mode: show players on the same map
                const currentMapId = $gameMap.mapId();
                for (const playerInfo of nm.players.values()) {
                    if (playerInfo.mapId === currentMapId) playersToDisplay.push(playerInfo);
                }
            }
            
            const bustSize = 64;
            const itemHeight = Math.max(this.lineHeight() * 2, bustSize);
            
            this.height = this.fittingHeight(playersToDisplay.length);
            this.createContents();

            playersToDisplay.forEach((player, index) => {
                if (!player) return;
                const y = index * (itemHeight + 8);
                const isLeader = nm.isInParty() && nm.party.leaderId === nm.players.get(player.id);
                
                this.drawFace(player.faceName, player.faceIndex, 0, y, bustSize, bustSize);
                this.drawText(player.name, bustSize + 10, y, this.contentsWidth() - bustSize - 10);
            });
        }
        
        fittingHeight(numItems) {
            const bustSize = 64;
            const itemHeight = Math.max(this.lineHeight() * 2, bustSize);
            return numItems * (itemHeight + 8) + this.padding * 2;
        }

        update() {
            super.update();
            this.visible = NetworkManager.instance.isMultiplayer();
        }
    }


    //=============================================================================
    // Plugin Command & Menu Integration
    //=============================================================================
    PluginManager.registerCommand(PLUGIN_NAME, 'openConnectionsMenu', () => {
        SceneManager.push(Scene_Multiplayer);
    });

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createPlayerListWindow();
    };

    Scene_Map.prototype.createPlayerListWindow = function() {
        const rect = this.playerListWindowRect();
        this._playerListWindow = new Window_PlayerList(rect);
        this.addWindow(this._playerListWindow);
    };

    Scene_Map.prototype.playerListWindowRect = function() {
        const ww = 280;
        const wh = 100; // Will be resized dynamically
        const wx = 10;
        const wy = 100;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        const isConnected = NetworkManager.instance.isMultiplayer();
        this.addCommand("Multiplayer", "multiplayer", true,79);
        if (isConnected) {
            this.addCommand("Party", "party", isConnected,75);
        }
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("multiplayer", this.commandMultiplayer.bind(this));
        this._commandWindow.setHandler("party", () => SceneManager.push(Scene_Party));
    };

    Scene_Menu.prototype.commandMultiplayer = function() {
        SceneManager.push(Scene_Multiplayer);
    };
    // NEW: Window for player list in multiplayer scene
class Window_MultiplayerPlayerList extends Window_Selectable {
    constructor(rect) {
        super(rect);
        this._data = [];
        this.refresh();
    }

    maxItems() { return this._data.length; }
    
    selectedPlayer() {
        return this._data[this.index()];
    }
    
    refresh() {
        const nm = NetworkManager.instance;
        const myId = nm.myId;
        const partyMembers = nm.isInParty() ? nm.party.members : [];
        
        // Only show players who are not yourself and not in your party
        this._data = Array.from(nm.players.entries())
            .filter(([id, _]) => id !== myId && !partyMembers.includes(id))
            .map(([id, info]) => ({ id, info }));

        this.contents.clear();
        super.refresh();
    }

    drawItem(index) {
        const item = this._data[index];
        if (item) {
            const rect = this.itemLineRect(index);
            this.drawFace(item.info.faceName, item.info.faceIndex, rect.x, rect.y, 64, 64);
            this.drawText(item.info.name, rect.x + 74, rect.y, rect.width - 74);
            this.drawText(`Map: ${item.info.mapId}`, rect.x + 74, rect.y + this.lineHeight(), rect.width - 74);
        }
    }

    itemHeight() {
        return 72; // Height to accommodate face graphic
    }

    processOk() {
        if (this._data[this.index()]) {
            this.callHandler('invite');
        } else {
            SoundManager.playBuzzer();
        }
    }
}

// NEW: Window for party management in multiplayer scene
class Window_MultiplayerParty extends Window_Selectable {
    constructor(rect) {
        super(rect);
        this.refresh();
    }

    refresh() {
        this.makeCommandList();
        this.contents.clear();
        super.refresh();
    }

    makeCommandList() {
        this._commands = [];
        const nm = NetworkManager.instance;
        
        if (nm.isInParty()) {
            this.drawText("Party Members:", 0, 0, this.contentsWidth(), 'center');
            nm.party.members.forEach(memberId => {
                const player = nm.players.get(memberId);
                if (player) {
                    let name = player.name;
                    if (memberId === nm.party.leaderId) name += " (Leader)";
                    if (memberId === nm.myId) name += " (You)";
                    this._commands.push({ name: name, symbol: 'member', enabled: false, player: player });
                }
            });
            this._commands.push({ name: "Leave Party", symbol: 'leave', enabled: true });
        } else {
            this._commands.push({ name: "You are not in a party.", symbol: 'none', enabled: false });
            this._commands.push({ name: "Use Player List to invite players.", symbol: 'info', enabled: false });
        }
    }
    
    maxItems() { return this._commands ? this._commands.length : 0; }

    drawItem(index) {
        const item = this._commands[index];
        const rect = this.itemLineRect(index + 1); // Offset by 1 for the title
        this.changePaintOpacity(item.enabled);
        
        if (item.player) {
            this.drawFace(item.player.faceName, item.player.faceIndex, rect.x, rect.y, 64, 64);
            this.drawText(item.name, rect.x + 74, rect.y + 12, rect.width - 74);
        } else if (item.symbol === 'leave') {
            this.changeTextColor(this.systemColor());
            this.drawText(item.name, rect.x, rect.y, rect.width, 'center');
        } else {
            this.drawText(item.name, rect.x, rect.y, rect.width, 'center');
        }
    }

    itemHeight() {
        return 72; // Height to accommodate face graphics
    }

    processOk() {
        const item = this._commands[this.index()];
        if (item && item.enabled) {
            this.callHandler(item.symbol);
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
        }
    }
}
    //=============================================================================
    // Scene_Party - New scene for party management
    //=============================================================================
    class Scene_Party extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createPartyStatusWindow();
            this.createOnlinePlayersWindow();
        }

        createHelpWindow() {
            const rect = new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(1, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("Select a player to invite to your party.");
            this.addWindow(this._helpWindow);
        }

        createPartyStatusWindow() {
            const rect = new Rectangle(0, this._helpWindow.y + this._helpWindow.height, 300, Graphics.boxHeight - this._helpWindow.y - this._helpWindow.height);
            this._partyStatusWindow = new Window_PartyStatus(rect);
            this._partyStatusWindow.setHandler('leave', this.onLeaveParty.bind(this));
            this._partyStatusWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._partyStatusWindow);
        }

        createOnlinePlayersWindow() {
            const rect = new Rectangle(300, this._helpWindow.y + this._helpWindow.height, Graphics.boxWidth - 300, Graphics.boxHeight - this._helpWindow.y - this._helpWindow.height);
            this._onlinePlayersWindow = new Window_OnlinePlayerList(rect);
            this._onlinePlayersWindow.setHandler('ok', this.onPlayerSelect.bind(this));
            this._onlinePlayersWindow.setHandler('cancel', () => this._partyStatusWindow.activate());
            this.addWindow(this._onlinePlayersWindow);
            this._partyStatusWindow.activate();
        }

        onLeaveParty() {
            NetworkManager.instance.sendPartyLeave();
            this.popScene();
        }
        
        onPlayerSelect() {
            const target = this._onlinePlayersWindow.selectedPlayer();
            if (target) {
                NetworkManager.instance.sendPartyInvite(target.id);
                this._onlinePlayersWindow.activate();
                this._helpWindow.setText(`Invitation sent to ${target.info.name}.`);
            }
        }
    }

    class Window_PartyStatus extends Window_Selectable {
        refresh() {
            this.makeCommandList();
            super.refresh();
        }

        makeCommandList() {
            this._commands = [];
            const nm = NetworkManager.instance;
            if (nm.isInParty()) {
                nm.party.members.forEach(memberId => {
                    const player = nm.players.get(memberId);
                    if (player) {
                        let name = player.name;
                        if (memberId === nm.party.leaderId) name += " (Leader)";
                        this._commands.push({ name: name, symbol: 'member', enabled: false });
                    }
                });
                this.addCommand("Leave Party", "leave", true);
            } else {
                 this._commands.push({ name: "You are not in a party.", symbol: 'none', enabled: false });
            }
        }

        addCommand(name, symbol, enabled = true, ext = null) {
            this._commands.push({ name, symbol, enabled, ext });
        }
        
        maxItems() { return this._commands ? this._commands.length : 0; }

        drawItem(index) {
            const item = this._commands[index];
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(item.enabled);
            this.drawText(item.name, rect.x, rect.y, rect.width);
        }

        processOk() {
            const item = this._commands[this.index()];
            if (item && item.enabled) {
                this.callHandler(item.symbol);
                SoundManager.playOk();
            } else {
                SoundManager.playBuzzer();
            }
        }
    }
    
    class Window_OnlinePlayerList extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._data = [];
            this.refresh();
        }

        maxItems() { return this._data.length; }
        
        selectedPlayer() {
            return this._data[this.index()];
        }
        
        refresh() {
            const nm = NetworkManager.instance;
            const myId = nm.myId;
            const partyMembers = nm.isInParty() ? nm.party.members : [];
            this._data = Array.from(nm.players.entries())
                .filter(([id, _]) => id !== myId && !partyMembers.includes(id))
                .map(([id, info]) => ({ id, info }));

            super.refresh();
        }

        drawItem(index) {
            const item = this._data[index];
            if (item) {
                const rect = this.itemLineRect(index);
                this.drawText(item.info.name, rect.x, rect.y, rect.width);
            }
        }
    }

    //=============================================================================
    // Sprite_Character - Name Display for Players
    //=============================================================================
    if (ShowPlayerNames) {
        const _Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
        Sprite_Character.prototype.initMembers = function() {
            _Sprite_Character_initMembers.call(this);
            this._nameplateSprite = null;
        };

        const _Sprite_Character_update = Sprite_Character.prototype.update;
        Sprite_Character.prototype.update = function() {
            _Sprite_Character_update.call(this);
            this.updateNameplate();
        };

        Sprite_Character.prototype.updateNameplate = function() {
            if (!this._character || !NetworkManager.instance.isMultiplayer()) {
                if (this._nameplateSprite) {
                    this.removeChild(this._nameplateSprite);
                    this._nameplateSprite = null;
                }
                return;
            }

            const eventId = this._character.eventId && this._character.eventId();
            const playerId = eventId ? MultiplayerManager.instance.eventPlayerMap.get(eventId) : null;
            
            if (playerId) {
                const playerInfo = NetworkManager.instance.players.get(playerId);
                if (playerInfo && !this._nameplateSprite) {
                    this.createNameplate(playerInfo.name || `Player ${playerId}`);
                }
            } else if (this._nameplateSprite) {
                this.removeChild(this._nameplateSprite);
                this._nameplateSprite = null;
            }
        };

        Sprite_Character.prototype.createNameplate = function(name) {
            this._nameplateSprite = new Sprite();
            this._nameplateSprite.bitmap = new Bitmap(200, 50);
            this._nameplateSprite.anchor.x = 0.5;
            this._nameplateSprite.anchor.y = 1;
            this._nameplateSprite.y = Number(NameplateConfig.yOffset || -50);
            
            const bitmap = this._nameplateSprite.bitmap;
            bitmap.fontSize = Number(NameplateConfig.fontSize || 18);
            bitmap.fontFace = NameplateConfig.fontFace || 'GameFont';
            bitmap.textColor = NameplateConfig.textColor || '#FFFFFF';
            bitmap.outlineColor = NameplateConfig.outlineColor || 'rgba(0, 0, 0, 0.7)';
            bitmap.outlineWidth = Number(NameplateConfig.outlineWidth || 3);
            bitmap.drawText(name, 0, 0, 200, 50, 'center');
            
            this.addChild(this._nameplateSprite);
        };
    }
})();
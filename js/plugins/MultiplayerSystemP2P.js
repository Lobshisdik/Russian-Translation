//=============================================================================
// MultiplayerSystemP2p.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v3.2.1 - Multiplayer with independent events, battles, and inventories.
 * @author Omni-Lex (Reworked for Independent Client States)
 * @help
 * This plugin enables an 8-player, leader-authoritative LAN multiplayer
 * experience for RPG Maker MZ.
 *
 * --- REWORK (v3.0.0) ---
 * This version represents a fundamental architectural shift from previous
 * versions.
 *
 * - INDEPENDENT EVENT EXECUTION:
 * Events (including text boxes, choices, and animations) now run ONLY on
 * the client of the player who triggered them. This prevents a textbox
 * from appearing on everyone's screen.
 *
 * - ISOLATED BATTLES:
 * When a player enters a battle, it only starts for that player. Other
 * players on the map will see the battling player's character disappear
 * until the battle is over.
 *
 * - SEPARATE INVENTORIES:
 * Each player has their own unique inventory, gold, and party. Event
 * commands like "Change Gold" or "Change Items" will only affect the
 * player who triggered the event.
 *
 * - SYNCHRONIZED WORLD STATE:
 * The shared multiplayer state is maintained exclusively through
 * Game Switches and Game Variables. If an event needs to cause a change
 * for all players (e.g., opening a door), it should modify a Switch.
 *
 * --- PREVIOUS FEATURES (v2.x) ---
 * - Support for up to 8 players
 * - Automatic leader handoff when current leader disconnects
 * - Offline state preservation (map position, switches, variables)
 * - Seamless reconnection with state restoration
 *
 * --- SETUP ---
 * 1. Create events named "Player1" through "Player8" on your maps.
 * 2. You need Node.js installed to run the "signaling_server.js" file.
 * 3. Run the server using: node signaling_server.js
 * 4. All players must be on the same local network.
 *
 * @param signalingServerUrl
 * @text Default Signaling Server URL
 * @desc The default WebSocket URL for the signaling server.
 * @default wss://hypernet-explorer-signaling-server.onrender.com
 *
 * @param maxPlayers
 * @text Maximum Players
 * @desc Maximum number of players allowed in a room (2-8).
 * @type number
 * @min 2
 * @max 8
 * @default 8
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

    const PLUGIN_NAME = 'MultiplayerSystemP2p';
    const params = PluginManager.parameters(PLUGIN_NAME);

    const DefaultSignalingServerUrl = params.signalingServerUrl || 'wss://hypernet-explorer-signaling-server.onrender.com';
    const MaxPlayers = Number(params.maxPlayers || 8);
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
                variables: this.captureAllVariables(),
                dungeonFloors: $gameSystem._dungeonFloors ? JSON.parse(JSON.stringify($gameSystem._dungeonFloors)) : null,
                stairLocations: $gameSystem._stairLocations ? JSON.parse(JSON.stringify($gameSystem._stairLocations)) : null,
                timestamp: Date.now()
            };
            console.log('Saved offline state:', this.savedState);
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
            if (this.savedState.dungeonFloors !== null) {
                $gameSystem._dungeonFloors = JSON.parse(JSON.stringify(this.savedState.dungeonFloors));
            }
            if (this.savedState.stairLocations !== null) {
                $gameSystem._stairLocations = JSON.parse(JSON.stringify(this.savedState.stairLocations));
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

            console.log('Restored offline state (Position Restore: ' + restorePosition + ')');
            return true;
        }

        clearState() {
            this.savedState = null;
        }
    }

    //=============================================================================
    // NetworkManager - Reworked to remove event synchronization
    //=============================================================================
    class NetworkManager {
        constructor() {
            this.ws = null;
            this.peerConnections = new Map();
            this.dataChannels = new Map();
            this.myId = null;
            this.roomId = null;
            this.isLeader = false;
            this.players = new Map();
            this.currentServerUrl = '';
            this.pendingTeleport = false;
            this.lastPlayerState = {};
            this.followLeader = true;
            this.offlineStateManager = new OfflineStateManager();
            this.leaderQueue = []; // Order of leadership succession
            this._reconnectAttempt = false; // Flag for reconnection in progress
            this._reconnectTimer = null; // Timer for forced restore
            this.excludedSelfSwitches = new Set();
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
            return this.ws && this.ws.readyState === WebSocket.OPEN && this.dataChannels.size > 0;
        }

        isMultiplayer() {
            return !!this.myId;
        }

        isConnecting() {
            return this.ws && this.ws.readyState === WebSocket.CONNECTING;
        }
        requestLeaderTeleport() {
            if (!this.isMultiplayer() || this.isLeader) return;
            
            const leaderId = this.getCurrentLeaderId();
            if (leaderId && this.dataChannels.has(leaderId)) {
                this.sendTo(leaderId, { type: 'request-teleport' });
            }
        }
        sendTeleportPosition(playerId) {
            if (!this.isLeader || !$gamePlayer) return;
            
            this.sendTo(playerId, {
                type: 'teleport-position',
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                direction: $gamePlayer.direction()
            });
        }

        connectToSignaling(serverUrl) {
            this.currentServerUrl = serverUrl;
            return new Promise((resolve, reject) => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    return resolve();
                }

                if (this.ws) {
                    this.ws.close();
                }

                this.ws = new WebSocket(serverUrl);
                NetworkManager.updateUI("Connecting to server...", true);

                const timeout = setTimeout(() => {
                    NetworkManager.updateUI("Server is starting up, please wait...");
                }, 5000);

                this.ws.onopen = () => {
                    clearTimeout(timeout);
                    console.log('Connected to signaling server.');
                    resolve();
                };

                this.ws.onmessage = (message) => {
                    const data = JSON.parse(message.data);
                    this.handleSignalingMessage(data);
                };

                this.ws.onerror = (error) => {
                    clearTimeout(timeout);
                    console.error('Signaling server connection error:', error);
                    NetworkManager.updateUI("Failed to connect to server.", true);
                    this.handleDisconnection(false); 
                    reject(error);
                };

                this.ws.onclose = () => {
                    clearTimeout(timeout);
                    console.log('Disconnected from signaling server.');
                    if (this.roomId) {
                        this.attemptReconnect();
                    } else {
                        this.handleDisconnection(false);
                    }
                };
            });
        }

        attemptReconnect() {
            if (this._reconnectAttempt) return;

            this._reconnectAttempt = true;
            NetworkManager.updateUI("Connection lost. Attempting to reconnect...");
            console.log("Connection lost. Attempting to reconnect...");

            this._reconnectTimer = setTimeout(() => {
                console.log("Reconnection failed after 10 seconds. Restoring offline state.");
                this.handleDisconnection(true); 
            }, 10000);

            this._reconnectLogic();
        }

        async _reconnectLogic() {
            try {
                await this.connectToSignaling(this.currentServerUrl);
                
                this.sendSignal({ 
                    type: 'rejoin', 
                    roomId: this.roomId, 
                    myId: this.myId,
                    playerInfo: this.createPlayerInfo()
                });

                NetworkManager.updateUI("Reconnected to signaling server. Rejoining room...");
            } catch (e) {
                console.warn("Reconnection attempt failed to connect to signaling.", e);
            }
        }


        cancelReconnect() {
            if (this._reconnectTimer) {
                clearTimeout(this._reconnectTimer);
                this._reconnectTimer = null;
            }
            this._reconnectAttempt = false;
        }

        static updateUI(text, isError = false) {
            const scene = SceneManager._scene;
            if (scene instanceof Scene_Multiplayer) {
                scene.updateStatus(text, isError);
            }
        }

        static updateRoomList(rooms) {
            const scene = SceneManager._scene;
            if (scene instanceof Scene_Multiplayer) {
                scene.updateRoomList(rooms);
            }
        }

        sendSignal(data) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(data));
            }
        }

        async initiateCreateRoom(serverUrl, followLeader = true) {
            try {
                this.offlineStateManager.saveCurrentState(); 
                this.isLeader = true;
                this.myId = 1;
                this.followLeader = followLeader;
                await this.connectToSignaling(serverUrl);
                const roomId = this.generateRoomCode();
                this.roomId = roomId;
                this.players.set(this.myId, this.createPlayerInfo());
                this.leaderQueue = [this.myId];
                this.sendSignal({ type: 'create', roomId, maxPlayers: MaxPlayers });
            } catch (e) {
                NetworkManager.updateUI("Failed to create room.", true);
                this.offlineStateManager.clearState();
            }
        }

        async initiateJoinRoom(serverUrl, roomId, followLeader = true) {
            try {
                this.offlineStateManager.saveCurrentState();
                this.isLeader = false;
                this.roomId = roomId;
                this.followLeader = followLeader;
                await this.connectToSignaling(serverUrl);
                this.sendSignal({ 
                    type: 'join', 
                    roomId, 
                    playerInfo: this.createPlayerInfo(),
                    offlineState: this.offlineStateManager.savedState
                });
            } catch (e) {
                NetworkManager.updateUI(`Failed to join room ${roomId}.`, true);
                this.offlineStateManager.clearState();
            }
        }

        generateRoomCode(length = 5) {
            const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        handleSignalingMessage(data) {
            switch (data.type) {
                case 'room-created':
                    this.cancelReconnect();
                    const scene = SceneManager._scene;
                    if (scene instanceof Scene_Multiplayer) {
                        scene.onRoomSetupSuccess(true);
                    }
                    break;
                    
                case 'room-list':
                    NetworkManager.updateRoomList(data.rooms);
                    break;

                case 'rejoin-success':
                    this.cancelReconnect();
                    console.log(`Successfully rejoined room ${data.roomId} as Player ${this.myId}.`);
                    NetworkManager.updateUI(`Reconnection successful. Room: ${data.roomId}`);
                    if (this.isLeader) {
                        for (const player of data.otherPlayers) {
                            this.createPeerConnection(player.id, true);
                        }
                    } else if (data.leaderId) {
                         NetworkManager.updateUI(`Rejoined. Waiting for leader P${data.leaderId} to re-establish connection...`);
                    }
                    break;
                    
                case 'room-joined':
                    this.cancelReconnect();
                    this.myId = data.yourId;
                    this.players.set(this.myId, this.createPlayerInfo());
                    console.log(`Joined room ${data.roomId} as Player ${this.myId}.`);
                    
                    this.leaderQueue = [1];
                    for (const player of data.otherPlayers) {
                        this.players.set(player.id, player.info);
                        if (player.id !== 1) {
                            this.leaderQueue.push(player.id);
                        }
                        if (this.isLeader) {
                            this.createPeerConnection(player.id, true);
                        }
                    }
                    if (!this.isLeader) {
                        this.leaderQueue.push(this.myId);
                    }
                    NetworkManager.refreshPlayerListUI();
                    break;
                    
                case 'player-joined':
                    this.cancelReconnect();
                    console.log(`Player ${data.playerId} joined.`);
                    this.players.set(data.playerId, data.playerInfo);
                    this.leaderQueue.push(data.playerId);
                    if (this.isLeader) {
                        this.createPeerConnection(data.playerId, true);
                    }
                    NetworkManager.refreshPlayerListUI();
                    break;
                    
                case 'player-left':
                    console.log(`Player ${data.playerId} left.`);
                    this.handlePlayerDisconnect(data.playerId);
                    break;
                    
                case 'webrtc-offer':
                    this.handleWebRTCOffer(data.from, data.offer);
                    break;
                    
                case 'webrtc-answer':
                    this.handleWebRTCAnswer(data.from, data.answer);
                    break;
                    
                case 'webrtc-candidate':
                    this.handleWebRTCCandidate(data.from, data.candidate);
                    break;
                    
                case 'error':
                    console.error('Server error:', data.message);
                    NetworkManager.updateUI(data.message, true);
                    this.handleDisconnection(true);
                    break;
            }
        }

        async createPeerConnection(targetId, isOffering) {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            
            this.peerConnections.set(targetId, pc);
            
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    this.sendSignal({ 
                        type: 'webrtc-candidate', 
                        to: targetId, 
                        from: this.myId, 
                        candidate: event.candidate 
                    });
                }
            };
            
            pc.ondatachannel = (event) => {
                this.setupDataChannel(targetId, event.channel);
            };
            
            if (isOffering) {
                const dataChannel = pc.createDataChannel('game-data');
                this.setupDataChannel(targetId, dataChannel);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                this.sendSignal({ type: 'webrtc-offer', to: targetId, from: this.myId, offer });
            }
        }

        setupDataChannel(peerId, channel) {
            this.dataChannels.set(peerId, channel);
            
            channel.onopen = () => {
                console.log(`Data channel with Player ${peerId} is open.`);
                if (this._reconnectAttempt) {
                    this.cancelReconnect();
                    NetworkManager.updateUI(`Reconnected to Player ${peerId}.`);
                }

                if (this.isLeader) {
                    this.sendFullGameState(peerId);
                    this.sendLeaderPosition(peerId);
                } else if (peerId === 1 || peerId === this.getCurrentLeaderId()) {
                    const scene = SceneManager._scene;
                    if (scene instanceof Scene_Multiplayer) {
                        scene.onRoomSetupSuccess(false);
                    }
                }
            };
            
            channel.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleGameMessage(peerId, data);
            };
            
            channel.onclose = () => {
                console.log(`Data channel with Player ${peerId} closed.`);
                this.handlePlayerDisconnect(peerId);
            };
            
            channel.onerror = (error) => {
                console.error(`Data channel error with Player ${peerId}:`, error);
            };
        }

        getCurrentLeaderId() {
            return this.leaderQueue.length > 0 ? this.leaderQueue[0] : null;
        }

        handlePlayerDisconnect(playerId) {
            this.peerConnections.get(playerId)?.close();
            this.dataChannels.get(playerId)?.close();
            this.peerConnections.delete(playerId);
            this.dataChannels.delete(playerId);
            this.players.delete(playerId);
            
            const leaderIndex = this.leaderQueue.indexOf(playerId);
            if (leaderIndex !== -1) {
                this.leaderQueue.splice(leaderIndex, 1);
            }
            
            MultiplayerManager.instance.removeRemotePlayer(playerId);
            NetworkManager.refreshPlayerListUI();
            
            if (playerId === this.getCurrentLeaderId() && this.leaderQueue.length > 0) {
                this.handleLeaderHandoff();
            }
            
            if (this.players.size === 1 && this.players.has(this.myId)) {
                this.handleLastPlayer();
            }
        }

        handleLeaderHandoff() {
            const newLeaderId = this.getCurrentLeaderId();
            
            if (newLeaderId === this.myId) {
                console.log('Becoming the new leader!');
                this.isLeader = true;
                
                this.broadcast({ 
                    type: 'leader-change', 
                    newLeaderId: this.myId 
                });
                
                for (const [playerId, channel] of this.dataChannels.entries()) {
                    if (channel.readyState === 'open') {
                        this.sendFullGameState(playerId);
                    }
                }
                
                NetworkManager.updateUI(`You are now the room leader (${this.roomId})`);
            }
        }

        handleLastPlayer() {
            console.log('Last player in room - restoring offline state');
            this.offlineStateManager.restoreState(false);
            MultiplayerManager.instance.clearRemotePlayers();
            NetworkManager.updateUI(`Room ${this.roomId} - Waiting for players (offline state restored)`);
        }

        handleDisconnection(restoreState) {
            this.cancelReconnect();

            if (restoreState && this.myId) {
                this.offlineStateManager.restoreState(true);
            }
            
            this.cleanup();
        }

        cleanup() {
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
            
            for (const pc of this.peerConnections.values()) {
                pc.close();
            }
            for (const dc of this.dataChannels.values()) {
                dc.close();
            }
            
            this.peerConnections.clear();
            this.dataChannels.clear();
            this.players.clear();
            this.leaderQueue = [];
            
            MultiplayerManager.instance.clearRemotePlayers();
            NetworkManager.refreshPlayerListUI();
            
            this.myId = null;
            this.roomId = null;
            this.isLeader = false;
            this.pendingTeleport = false;
            this.lastPlayerState = {};
            this.followLeader = true;
            this.offlineStateManager.clearState();
            
            $gameSwitches.setValue(66, false);
            
            console.log('Cleaned up multiplayer session.');
        }

        disconnect(restoreState = true) {
            this.handleDisconnection(restoreState);
        }
        
        broadcast(data, reliable = true) {
            if (!this.isMultiplayer()) return;
            const message = JSON.stringify(data);
            
            for (const channel of this.dataChannels.values()) {
                if (channel.readyState === 'open') {
                    channel.send(message);
                }
            }
        }

        sendTo(playerId, data) {
            if (!this.isMultiplayer()) return;
            const channel = this.dataChannels.get(playerId);
            if (channel && channel.readyState === 'open') {
                channel.send(JSON.stringify(data));
            }
        }

        handleGameMessage(fromId, data) {
            data.from = fromId;
            this.processGameMessage(data);
            
            if (this.isLeader) {
                for (const [id, channel] of this.dataChannels.entries()) {
                    if (id !== fromId && channel.readyState === 'open') {
                        channel.send(JSON.stringify(data));
                    }
                }
            }
        }

        onDungeonGenerated() {
            if (this.isMultiplayer() && this.isLeader) {
                this.broadcast({
                    type: 'dungeon-data',
                    dungeonFloors: JSON.parse(JSON.stringify($gameSystem._dungeonFloors)),
                    stairLocations: JSON.parse(JSON.stringify($gameSystem._stairLocations)),
                    dungeonGenerated: $gameSystem._dungeonGenerated,
                    mapRegion13Cache: JSON.parse(JSON.stringify($gameSystem._mapRegion13Cache || {}))
                });
            }
        }
        handleTeleportPosition(data) {
            if (this.isLeader) return;
            
            // Teleport to exact same position as leader
            if ($gameMap.mapId() !== data.mapId) {
                this.pendingTeleport = true;
                $gamePlayer.reserveTransfer(data.mapId, data.x, data.y, data.direction, 0);
                $gamePlayer.requestMapReload();
            } else {
                // Same map, just move to exact position
                $gamePlayer.locate(data.x, data.y);
                $gamePlayer.setDirection(data.direction);
            }
        }
        processGameMessage(data) {
            switch(data.type) {
                case 'full-state':
                    this.applyFullGameState(data.switches, data.variables);
                    break;
                    
                case 'leader-change':
                    this.handleLeaderChange(data.newLeaderId);
                    break;
                case 'treasure-room-data':
                        console.log('Received treasure room data from leader');
                        if (window.TreasureRoomSystem) {
                            window.TreasureRoomSystem.syncFromNetwork(data.treasureRoomData);
                        }
                        break;
                case 'treasure-room-visit':
                    console.log('Player visited treasure room:', data);
                    if (window.TreasureRoomSystem) {
                        window.TreasureRoomSystem.handlePeerVisit(data);
                    }
                    break;

                case 'house-visit':
                    console.log('Player visited house:', data);
                    if (window.TreasureRoomSystem) {
                        window.TreasureRoomSystem.handlePeerHouseVisit(data);
                    }
                    break;
                case 'dungeon-data':
                    console.log('Received dungeon data from leader');
                    $gameSystem._dungeonFloors = JSON.parse(JSON.stringify(data.dungeonFloors));
                    $gameSystem._stairLocations = JSON.parse(JSON.stringify(data.stairLocations));
                    $gameSystem._dungeonGenerated = data.dungeonGenerated || true;
                    $gameSystem._mapRegion13Cache = JSON.parse(JSON.stringify(data.mapRegion13Cache || {}));
                    break;               
                case 'leader-position':
                    this.handleLeaderPosition(data);
                    break;
                case 'request-teleport':
                    if (this.isLeader) {
                        this.sendTeleportPosition(data.from);
                    }
                    break;
                    
                case 'teleport-position':
                    this.handleTeleportPosition(data);
                    break;
                /*
                // ENEMY_SYNC_DISABLE - Comment this case to disable enemy sync
                case 'enemy-move':
                    if ($gameMap.mapId() === data.mapId) {
                        MultiplayerManager.instance.updateEnemyPosition(
                            data.eventId, data.x, data.y, data.direction
                        );
                    }
                    break;*/
                    
                case 'switch-change':
                    $gameSwitches.setValue(data.id, data.value, true);
                    break;
                    
                case 'variable-change':
                    $gameVariables.setValue(data.id, data.value, true);
                    break;
                case 'self-switch-change':
                    if ($gameMap.mapId() === data.mapId) {
                        const key = [data.mapId, data.eventId, data.switchType];
                        $gameSelfSwitches.setValue(key, data.value, true);
                        
                        const event = $gameMap.event(data.eventId);
                        if (event) {
                            event.refresh();
                        }
                    }
                    break;    
                case 'player-move':
                    this.updateRemotePlayer(data.from, data);
                    break;
                    
                case 'player-meta':
                    this.updatePlayerInfo(data.from, data.info);
                    break;
                case 'full-self-switches':
                    for (const keyString in data.selfSwitches) {
                         const keyParts = keyString.split(',');
                         const parsedKey = [parseInt(keyParts[0], 10), parseInt(keyParts[1], 10), keyParts[2]];
                        $gameSelfSwitches.setValue(parsedKey, data.selfSwitches[keyString], true);
                    }
                    
                    console.log("Self switches synchronized.");
                    break;
                case 'player-state-change':
                    MultiplayerManager.instance.updateRemotePlayerState(data.from, data.state);
                    break;
                    
                case 'map-transfer':
                    const playerInfo = this.players.get(data.from);
                    if (playerInfo) {
                        playerInfo.mapId = data.mapId;
                    }
                    MultiplayerManager.instance.handlePlayerMapTransfer(data.from, data.mapId);
                    break;
            }
        }

        handleLeaderChange(newLeaderId) {
            const leaderIndex = this.leaderQueue.indexOf(newLeaderId);
            if (leaderIndex !== -1) {
                this.leaderQueue.splice(leaderIndex, 1);
                this.leaderQueue.unshift(newLeaderId);
            }
            
            if (newLeaderId === this.myId) {
                this.isLeader = true;
                console.log('Confirmed as new leader');
            }
        }

        sendLeaderPosition(playerId) {
            if (!this.isLeader || !$gamePlayer) return;
            
            this.sendTo(playerId, {
                type: 'leader-position',
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y
            });
        }

        handleLeaderPosition(data) {
            if (this.isLeader || !this.followLeader) return;
            
            if ($gameMap.mapId() !== data.mapId) {
                this.pendingTeleport = true;
                // Use exact same position as leader, not offset
                $gamePlayer.reserveTransfer(data.mapId, data.x, data.y, 2, 0);
                $gamePlayer.requestMapReload();
            }
        }

        createPlayerInfo() {
            const leader = $gameParty.leader();
            const actor = $gameActors.actor(1);
            return {
                name: actor.name(),
                className: actor.currentClass().name,
                characterName: leader.characterName(),
                characterIndex: leader.characterIndex(),
                faceName: leader.faceName(),
                faceIndex: leader.faceIndex(),
                mapId: $gameMap.mapId()
            };
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
                this.broadcast({ type: 'switch-change', id: switchId, value: value });
            }
        }
        shouldSyncSelfSwitch(mapId, eventId, switchType) {
            const eventName = $dataMap && $dataMap.events && $dataMap.events[eventId] ? 
                            $dataMap.events[eventId].name : '';
            
            if (eventName.match(/^Player\d+$/)) {
                return false;
            }
            
            const excludeKey = `${mapId}_${eventId}`;
            if (this.excludedSelfSwitches.has(excludeKey)) {
                return false;
            }
            
            return true;
        }


        onVariableChange(variableId, value) {
            if (this.isMultiplayer() && !ExcludedVariables.includes(variableId)) {
                this.broadcast({ type: 'variable-change', id: variableId, value: value });
            }
        }
        onSelfSwitchChange(mapId, eventId, switchType, value) {
            if (this.isMultiplayer() && this.shouldSyncSelfSwitch(mapId, eventId, switchType)) {
                this.broadcast({ 
                    type: 'self-switch-change', 
                    mapId: mapId,
                    eventId: eventId,
                    switchType: switchType,
                    value: value 
                });
            }
        }


        sendFullGameState(targetPlayerId) {
            if (!this.isLeader) return;
            
            const switches = {};
            const variables = {};
            const selfSwitches = {};
            for(let i = 1; i < $dataSystem.switches.length; i++) {
                if(!ExcludedSwitches.includes(i)) {
                    switches[i] = $gameSwitches.value(i);
                }
            }
            
            for(let i = 1; i < $dataSystem.variables.length; i++) {
                if(!ExcludedVariables.includes(i)) {
                    variables[i] = $gameVariables.value(i);
                }
            }
            
            for (const key in $gameSelfSwitches._data) {
                const [mapId, eventId, switchType] = key.split(',').map((v, i) => i < 2 ? parseInt(v) : v);
                if (this.shouldSyncSelfSwitch(mapId, eventId, switchType)) {
                    selfSwitches[key] = $gameSelfSwitches._data[key];
                }
            }
            this.sendTo(targetPlayerId, {type: 'full-state', switches, variables});
            this.sendTo(targetPlayerId, {
                type: 'full-self-switches', 
                selfSwitches: selfSwitches
            });
            
            if ($gameSystem._dungeonFloors && $gameSystem._stairLocations && $gameSystem._dungeonGenerated) {
                this.sendTo(targetPlayerId, {
                    type: 'dungeon-data',
                    dungeonFloors: JSON.parse(JSON.stringify($gameSystem._dungeonFloors)),
                    stairLocations: JSON.parse(JSON.stringify($gameSystem._stairLocations)),
                    dungeonGenerated: $gameSystem._dungeonGenerated,
                    mapRegion13Cache: JSON.parse(JSON.stringify($gameSystem._mapRegion13Cache || {}))
                });
            }

            if (window.TreasureRoomSystem) {
                const treasureRoomData = window.TreasureRoomSystem.getNetworkData();
                if (treasureRoomData) {
                    this.sendTo(targetPlayerId, {
                        type: 'treasure-room-data',
                        treasureRoomData: treasureRoomData
                    });
                }
            }

            for(const [id, player] of this.players.entries()) {
                if (id !== targetPlayerId) {
                    this.sendTo(targetPlayerId, { type: 'player-meta', from: id, info: player });
                }
            }
            /*
            // ENEMY_SYNC_DISABLE - Comment this section to disable enemy sync
            setTimeout(() => {
                for (const [eventId, position] of MultiplayerManager.instance.enemyPositions.entries()) {
                    this.sendTo(targetPlayerId, {
                        type: 'enemy-move',
                        eventId: eventId,
                        mapId: $gameMap.mapId(),
                        x: position.x,
                        y: position.y,
                        direction: position.direction
                    });
                }
            }, 200);*/
        }


        broadcastTreasureRoomVisit(locationKey, treasureRoomId) {
            if (this.isMultiplayer()) {
                this.broadcast({
                    type: 'treasure-room-visit',
                    locationKey: locationKey,
                    treasureRoomId: treasureRoomId,
                    playerId: this.myId
                });
            }
        }

        broadcastHouseVisit(locationKey, houseId, seed, modifications) {
            if (this.isMultiplayer()) {
                this.broadcast({
                    type: 'house-visit',
                    locationKey: locationKey,
                    houseId: houseId,
                    seed: seed,
                    modifications: modifications,
                    playerId: this.myId
                });
            }
        }
        applyFullGameState(switches, variables) {
            for(const id in switches) {
                $gameSwitches.setValue(Number(id), switches[id], true);
            }
            for(const id in variables) {
                $gameVariables.setValue(Number(id), variables[id], true);
            }
            console.log("Full game state (Switches/Variables) synchronized.");
        }
        
        updateLocalPlayerPosition() {
            if (!this.isMultiplayer() || !$gamePlayer) return;

            const player = $gamePlayer;
            const lastState = this.lastPlayerState;

            const hasChanged =
                lastState.x !== player.x ||
                lastState.y !== player.y ||
                lastState.direction !== player.direction() ||
                lastState.pattern !== player.pattern() ||
                lastState.opacity !== player.opacity();

            if (hasChanged) {
                const newState = {
                    x: player.x,
                    y: player.y,
                    direction: player.direction(),
                    pattern: player.pattern(),
                    moveSpeed: player.realMoveSpeed(),
                    opacity: player.opacity(),
                    blendMode: player.blendMode(),
                };
                
                const message = JSON.stringify({
                    type: 'player-move',
                    ...newState
                });

                const myMapId = $gameMap.mapId();

                for (const [playerId, playerInfo] of this.players.entries()) {
                    if (playerId === this.myId) continue;

                    if (playerInfo.mapId === myMapId) {
                        const channel = this.dataChannels.get(playerId);
                        if (channel && channel.readyState === 'open') {
                            channel.send(message);
                        }
                    }
                }

                this.lastPlayerState = newState;
            }
        }

        updateRemotePlayer(playerId, data) {
            MultiplayerManager.instance.updateRemotePlayerPosition(playerId, data);
        }

        onMapTransfer() {
            if(this.isMultiplayer()) {
                this.broadcast({type: 'map-transfer', mapId: $gameMap.mapId()});
                
                const myInfo = this.players.get(this.myId);
                if (myInfo) {
                    myInfo.mapId = $gameMap.mapId();
                }

                if (this.isLeader) {
                    setTimeout(() => {
                        for (const playerId of this.dataChannels.keys()) {
                            this.sendLeaderPosition(playerId);
                        }
                    }, 100);
                }
            }
        }

        async fetchRoomList(serverUrl) {
            try {
                await this.connectToSignaling(serverUrl);
                this.sendSignal({ type: 'list-rooms' });
            } catch (e) {
                NetworkManager.updateUI("Failed to fetch room list (Server connection issue).", true);
            }
        }

        async handleWebRTCOffer(fromId, offer) {
            await this.createPeerConnection(fromId, false);
            const pc = this.peerConnections.get(fromId);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            this.sendSignal({ type: 'webrtc-answer', to: fromId, from: this.myId, answer });
        }

        async handleWebRTCAnswer(fromId, answer) {
            const pc = this.peerConnections.get(fromId);
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }

        async handleWebRTCCandidate(fromId, candidate) {
            const pc = this.peerConnections.get(fromId);
            if (pc && candidate) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch(e) {
                    console.error("Error adding received ice candidate", e);
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
            // ENEMY_SYNC_DISABLE - Comment these lines to disable enemy sync
            // this.enemyEvents = new Map();
            // this.enemyPositions = new Map();
            // this.enemyMovementQueue = new Map();
            // END_ENEMY_SYNC_DISABLE
            this.nameplateSprites = new Map();
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
                
                // ENEMY_SYNC_DISABLE - Comment this line to disable enemy sync
                // this.processEnemyMovementQueue();
                // END_ENEMY_SYNC_DISABLE
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
        // ENEMY_SYNC_DISABLE - Comment entire method to disable enemy sync
        /*
        processEnemyMovementQueue() {
            for (const [eventId, movements] of this.enemyMovementQueue.entries()) {
                if (movements.length === 0) continue;
        
                const event = this.enemyEvents.get(eventId);
                if (!event || event.isMoving()) continue;
        
                const nextMove = movements.shift();
                if (nextMove) {
                    this.executeMovement(event, nextMove);
                }
            }
        }*/
        
        /*    
        setupEnemyEvents() {
            if (!$dataMap.events) return;
            
            this.enemyEvents.clear();
            this.enemyPositions.clear();
            this.enemyMovementQueue.clear();
            
            for (const event of $dataMap.events) {
                if (event && event.name === 'Enemy') {
                    const mapEvent = $gameMap.event(event.id);
                    if (mapEvent) {
                        this.enemyEvents.set(event.id, mapEvent);
                        this.enemyPositions.set(event.id, {
                            x: mapEvent.x,
                            y: mapEvent.y,
                            direction: mapEvent.direction()
                        });
                    }
                }
            }
        }
        */
        // END_ENEMY_SYNC_DISABLE
        executeMovement(event, moveData) {
            // Set visual properties from the synchronized data
            event.setMoveSpeed(moveData.moveSpeed);
            event.setPattern(moveData.pattern || event.pattern());
            event.setOpacity(moveData.opacity === undefined ? 255 : moveData.opacity);
            event.setBlendMode(moveData.blendMode === undefined ? 0 : moveData.blendMode);
        
            const dx = moveData.x - event.x;
            const dy = moveData.y - event.y;
        
            // If the event is more than a tile away (desynced), teleport to the correct spot
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                event.locate(moveData.x, moveData.y);
            } 
            // Otherwise, perform a smooth one-tile move toward the destination
            else if (dx !== 0 || dy !== 0) {
                const sx = event.deltaXFrom(moveData.x); // sx = current.x - target.x
                const sy = event.deltaYFrom(moveData.y); // sy = current.y - target.y
                if (Math.abs(sx) > Math.abs(sy)) {
                    event.moveStraight(sx > 0 ? 4 : 6); // Move left or right
                } else if (sy !== 0) {
                    event.moveStraight(sy > 0 ? 8 : 2); // Move up or down
                }
            }
        
            // After the move, set the final direction to match the leader's event
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
            // ENEMY_SYNC_DISABLE - Comment this line to disable enemy sync
            // this.enemyMovementQueue.clear();
            // END_ENEMY_SYNC_DISABLE
            }

        syncEnemyPosition(eventId, x, y, direction) {
            if (!NetworkManager.instance.isMultiplayer() || !NetworkManager.instance.isLeader) return;
            
            this.enemyPositions.set(eventId, { x, y, direction });
            
            NetworkManager.instance.broadcast({
                type: 'enemy-move',
                eventId: eventId,
                mapId: $gameMap.mapId(),
                x: x,
                y: y,
                direction: direction
            });
        }
        // ENEMY_SYNC_DISABLE - Comment entire method to disable enemy sync
/*
        updateEnemyPosition(eventId, x, y, direction) {
            if (!this.enemyEvents.has(eventId)) return;
        
            const event = this.enemyEvents.get(eventId);
            if (!event) return;
        
            if (!this.enemyMovementQueue.has(eventId)) {
                this.enemyMovementQueue.set(eventId, []);
            }
            const movementQueue = this.enemyMovementQueue.get(eventId);
            const moveData = {
                x: x,
                y: y,
                direction: direction,
                moveSpeed: event.realMoveSpeed(),
            };
        
            const lastQueuedPos = movementQueue.length > 0 ? movementQueue[movementQueue.length - 1] : event;
            const dx = Math.abs(x - lastQueuedPos.x);
            const dy = Math.abs(y - lastQueuedPos.y);
        
            if (dx > 3 || dy > 3 || movementQueue.length > 8) {
                movementQueue.length = 0; 
                event.locate(x, y);
                event.setDirection(direction);
            } else {
                movementQueue.push(moveData);
            }
        
            this.enemyPositions.set(eventId, { x, y, direction });
        }
*/
// END_ENEMY_SYNC_DISABLE
        onMapLoaded() {
            if (NetworkManager.instance.isMultiplayer()) {
                NetworkManager.instance.onMapTransfer();
                this.setupPlayerEvents();
                /*
                setTimeout(() => {
                    this.setupEnemyEvents();
                }, 100);*/
                
                if (NetworkManager.instance.pendingTeleport && !NetworkManager.instance.isLeader && NetworkManager.instance.followLeader) {
                    NetworkManager.instance.pendingTeleport = false;
                }
            }
        }

        setupPlayerEvents() {
            const playerEventNames = Array.from({length: MaxPlayers}, (_, i) => `Player${i + 1}`);
            
            this.playerEvents.clear();
            this.eventPlayerMap.clear();
            this.playerMovementQueue.clear();
            
            if (!$dataMap.events) return;

            for (const event of $dataMap.events) {
                if (event && playerEventNames.includes(event.name)) {
                    const mapEvent = $gameMap.event(event.id);
                    if (mapEvent) {
                        mapEvent.setOpacity(0);
                        mapEvent._characterName = '';
                    }
                }
            }
            
            const myId = NetworkManager.instance.myId;
            const currentMapId = $gameMap.mapId();
            const allPlayers = Array.from(NetworkManager.instance.players.keys());
            
            for (const playerId of allPlayers) {
                if (playerId === myId) continue;
                
                const playerInfo = NetworkManager.instance.players.get(playerId);
                if (!playerInfo || playerInfo.mapId !== currentMapId) {
                    continue;
                }
                
                const eventName = `Player${playerId}`;
                const eventData = $dataMap.events.find(e => e && e.name === eventName);

                if (eventData) {
                    this.playerEvents.set(playerId, eventData.id);
                    this.eventPlayerMap.set(eventData.id, playerId);
                    this.playerMovementQueue.set(playerId, []);
                    
                    const event = $gameMap.event(eventData.id);
                    if (event) {
                        event._characterName = playerInfo.characterName;
                        event._characterIndex = playerInfo.characterIndex;
                        event.setOpacity(255);
                        event.refresh();
                    }
                }
            }
        }
        
        updateRemotePlayerPosition(playerId, data) {
            const event = this.getRemotePlayer(playerId);
            if (!event) return;
            
            if (!this.playerMovementQueue.has(playerId)) {
                this.playerMovementQueue.set(playerId, []);
            }
            
            const movementQueue = this.playerMovementQueue.get(playerId);
            const dx = Math.abs(data.x - event.x);
            const dy = Math.abs(data.y - event.y);
            
            if (dx > 2 || dy > 2 || movementQueue.length > 10) {
                movementQueue.length = 0;
                event.locate(data.x, data.y);
                this.executeMovement(event, data);
            } else {
                movementQueue.push(data);
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
            const currentMapId = $gameMap.mapId();
            const playerInfo = NetworkManager.instance.players.get(playerId);
            
            if (playerInfo) {
                // Update the player's map ID in the network manager
                playerInfo.mapId = mapId;
            }
            
            if (mapId === currentMapId) {
                // Player is transferring TO this map - set up their sprite
                this.setupPlayerEvents();
            } else {
                // Player is transferring AWAY from this map - hide their sprite
                const event = this.getRemotePlayer(playerId);
                if (event) {
                    event.setOpacity(0);
                    event._characterName = '';
                    // Remove from tracking but don't clear the event mapping
                    // so it can be reused when they return
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
    class Scene_Multiplayer extends Scene_MenuBase {
            constructor() {
                super();
                this._serverUrl = localStorage.getItem('gmn_mp_serverUrl') || DefaultSignalingServerUrl;
                this._roomCode = NetworkManager.instance.roomId || '';
                this._followLeader = localStorage.getItem('gmn_mp_followLeader') !== 'false';
                this._roomList = [];
                this._waitingForRoomList = false;
            }
    
        create() {
            super.create();
            this.createHelpWindow();
            this.createInputWindow();
            this.createStatusWindow();
            
            if (NetworkManager.instance.isMultiplayer()) {
                this._helpWindow.setText('Connected to room: ' + NetworkManager.instance.roomId);
                NetworkManager.instance.fetchRoomList(this._serverUrl);
            }
        }
    commandTeleportToLeader() {
        const networkManager = NetworkManager.instance;
        if (!networkManager.isMultiplayer() || networkManager.isLeader) {
            SoundManager.playBuzzer();
            this._helpWindow.setText('Cannot teleport - you are the leader or not connected!');
            return;
        }
        
        const leaderId = networkManager.getCurrentLeaderId();
        if (!leaderId) {
            SoundManager.playBuzzer();
            this._helpWindow.setText('No leader found to teleport to!');
            return;
        }
        
        // Request leader position for teleport
        networkManager.requestLeaderTeleport();
        this._helpWindow.setText('Teleporting to leader...');
        SoundManager.playOk();
        
        // Return to map after a short delay
        setTimeout(() => SceneManager.goto(Scene_Map), 1000);
    }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText(`LAN Multiplayer (Max ${MaxPlayers} players) - Tab to navigate, Enter to select`);
            this.addWindow(this._helpWindow);
        }
    
        helpWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(2, false);
            return new Rectangle(wx, wy, ww, wh);
        }
    
        createInputWindow() {
            const rect = this.inputWindowRect();
            this._inputWindow = new Window_MultiplayerInput(rect);
            this._inputWindow.setServerUrl(this._serverUrl);
            this._inputWindow.setRoomCode(this._roomCode);
            this._inputWindow.setFollowLeader(this._followLeader);
            this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
            this._inputWindow.setHandler('cancel', this.popScene.bind(this));
            this._inputWindow.activate();
            this._inputWindow.select(0);
            this.addWindow(this._inputWindow);
        }
    
        inputWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.y + this._helpWindow.height;
            const ww = Math.floor(Graphics.boxWidth * 0.6);
            const wh = this.calcWindowHeight(5, true);
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
    
        onInputOk() {
            this._serverUrl = this._inputWindow.serverUrl();
            this._roomCode = this._inputWindow.roomCode();
            this._followLeader = this._inputWindow.followLeader();
            
            localStorage.setItem('gmn_mp_serverUrl', this._serverUrl);
            
            const selectedAction = this._inputWindow.currentSymbol();
            
            switch(selectedAction) {
                case 'create':
                    this.commandCreate();
                    break;
                case 'join':
                    this.commandJoin();
                    break;
                case 'disconnect':
                    this.commandDisconnect();
                    break;
                case 'teleportToLeader':
                    this.commandTeleportToLeader();
                    break;
            }
        }
    
        commandCreate() {
            if (!this._serverUrl) {
                SoundManager.playBuzzer();
                this._helpWindow.setText('Server URL cannot be empty!');
                return;
            }
            
            this._helpWindow.setText('Creating room...');
            NetworkManager.instance.initiateCreateRoom(this._serverUrl, this._followLeader);
        }
    
    async commandJoin() {
        if (!this._serverUrl) {
            SoundManager.playBuzzer();
            this._helpWindow.setText('Server URL cannot be empty!');
            return;
        }
        
        this._helpWindow.setText('Fetching room list...');
        
        try {
            if (NetworkManager.instance.isMultiplayer()) {
                NetworkManager.instance.disconnect(true);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            this._roomList = [];
            this._waitingForRoomList = true;
            
            await NetworkManager.instance.fetchRoomList(this._serverUrl);

        } catch (e) {
            this._helpWindow.setText('Failed to fetch room list.');
            this._waitingForRoomList = false;
        }
    }


        commandDisconnect() {
            this._helpWindow.setText('Disconnecting...');
            const networkManager = NetworkManager.instance;
            
            const shouldRestoreState = !networkManager.isLeader;
            networkManager.disconnect(shouldRestoreState);
            $gameSwitches.setValue(66, false);
            this._roomCode = '';
            this._inputWindow.setRoomCode('');
            this._inputWindow.refresh();
            this._inputWindow.select(0);
            this._helpWindow.setText('Disconnected. Ready to connect.');
        }
    
        showRoomSelection(rooms) {
            if (rooms.length === 0) {
                this._helpWindow.setText('No other rooms available on this server.');
                return;
            }
            
            const rect = this.roomSelectionRect();
            this._roomSelectionWindow = new Window_RoomSelection(rect);
            this._roomSelectionWindow.setRooms(rooms);
            this._roomSelectionWindow.setHandler('ok', this.onRoomSelected.bind(this));
            this._roomSelectionWindow.setHandler('cancel', this.onRoomSelectionCancel.bind(this));
            this.addWindow(this._roomSelectionWindow);
            this._roomSelectionWindow.activate();
            this._roomSelectionWindow.select(0);
            this._inputWindow.deactivate();
        }
    
        roomSelectionRect() {
            const width = 400;
            const height = 300;
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            return new Rectangle(x, y, width, height);
        }
    
        onRoomSelected() {
            const room = this._roomSelectionWindow.currentRoom();
            if (room) {
                this._roomCode = room.id;
                this._helpWindow.setText(`Joining room ${this._roomCode}...`);
                NetworkManager.instance.initiateJoinRoom(this._serverUrl, this._roomCode, this._followLeader);
                this.closeRoomSelection();
            }
        }
    
        onRoomSelectionCancel() {
            this.closeRoomSelection();
            this._inputWindow.activate();
        }
    
        closeRoomSelection() {
            if (this._roomSelectionWindow) {
                this._roomSelectionWindow.close();
                this._roomSelectionWindow.hide();                
                this._roomSelectionWindow = null;
            }
        }
    
        updateStatus(text, isError = false) {
            this._helpWindow.setText(text);
            if (isError) {
                SoundManager.playBuzzer();
            }
        }
    
    updateRoomList(rooms) {
        this._roomList = rooms;
        
        if (this._waitingForRoomList) {
            this._waitingForRoomList = false;
            
            const currentRoomId = NetworkManager.instance.roomId;
            const availableRooms = rooms.filter(room => room.id !== currentRoomId);
            
            if (availableRooms.length === 0) {
                this._helpWindow.setText('No other rooms available on this server.');
            } else {
                this.showRoomSelection(availableRooms);
            }
        }
        
        if (this._roomSelectionWindow && this._roomSelectionWindow.active) {
            const currentRoomId = NetworkManager.instance.roomId;
            const availableRooms = rooms.filter(room => room.id !== currentRoomId);
            this._roomSelectionWindow.setRooms(availableRooms);
        }
    }
    
        onRoomSetupSuccess(isLeader) {
            if (isLeader) {
                this._helpWindow.setText(`Room Created: ${NetworkManager.instance.roomId}\nStarting game...`);
            } else {
                this._helpWindow.setText("Success! Joining game...");
            }
            SoundManager.playOk();
            
            $gameSwitches.setValue(66, true);
            
            setTimeout(() => SceneManager.goto(Scene_Map), 1500);
        }
    
        update() {
            super.update();
            
            if (this._statusWindow) {
                this._statusWindow.refresh();
            }
        }
    }
    
class Window_MultiplayerInput extends Window_Selectable {
    constructor(rect) {
        super(rect);
        this._serverUrl = '';
        this._roomCode = '';
        this._followLeader = true;
        this._editIndex = -1;
        this.refresh();
    }

    maxItems() {
        return 6; 
    }

makeCommandList() {
    const connected = NetworkManager.instance.isMultiplayer();
    const isLeader = NetworkManager.instance.isLeader;

    this._list = [];
    this._list.push({name: 'Server URL:', symbol: 'serverUrl', enabled: !connected});
    this._list.push({name: 'Room Code:', symbol: 'roomCode', enabled: !connected});
    this._list.push({name: 'Follow Leader:', symbol: 'followLeader', enabled: true});
    
    if (connected) {
        // Add teleport to leader button for non-leaders
        if (!isLeader) {
            this._list.push({name: '► Teleport to Leader', symbol: 'teleportToLeader', enabled: true});
        }
        this._list.push({name: '► Disconnect', symbol: 'disconnect', enabled: true});
        this._list.push({name: '► Join Another Room', symbol: 'join', enabled: true});
    } else {
        this._list.push({name: '► Create Room', symbol: 'create', enabled: true});
        this._list.push({name: '► Join Room', symbol: 'join', enabled: true});
    }
}

    itemHeight() { return this.lineHeight() + 8; }
    serverUrl() { return this._serverUrl; }
    roomCode() { return this._roomCode; }
    followLeader() { return this._followLeader; }

    setServerUrl(url) { this._serverUrl = url || ''; this.refresh(); }
    setRoomCode(code) { this._roomCode = (code || '').toUpperCase(); this.refresh(); }
    setFollowLeader(value) { 
        this._followLeader = value; 
        localStorage.setItem('gmn_mp_followLeader', this._followLeader);
        
        if (NetworkManager.instance) {
            NetworkManager.instance.followLeader = this._followLeader;
        }
        
        this.refresh(); 
    }
    currentSymbol() { return this._list[this.index()] ? this._list[this.index()].symbol : null; }

// Fix 1: Move "ON/OFF" text 30px to the right for Follow Leader option
// Replace the existing drawItem method in Window_MultiplayerInput class

drawItem(index) {
    if (!this._list || !this._list[index]) return;
    const rect = this.itemLineRect(index);
    const labelWidth = 200;
    
    this.resetTextColor();
    if (index === this.index()) {
        this.changePaintOpacity(false);
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, ColorManager.gaugeBackColor());
        this.changePaintOpacity(true);
    }
    
    const symbol = this._list[index].symbol;
    const isEnabled = this._list[index].enabled;
    
    switch(symbol) {
        case 'serverUrl':
            this.changePaintOpacity(isEnabled);
            this.drawText('Server URL:', rect.x + 4, rect.y, labelWidth);
            this.drawText(this._serverUrl || '(Click to edit)', rect.x + labelWidth, rect.y, rect.width - labelWidth - 4);
            this.changePaintOpacity(true);
            break;
        case 'roomCode':
            this.changePaintOpacity(isEnabled);
            this.drawText('Room Code:', rect.x + 4, rect.y, labelWidth);
            this.drawText(this._roomCode || '(Click to edit)', rect.x + labelWidth, rect.y, rect.width - labelWidth - 4);
            this.changePaintOpacity(true);
            break;
        case 'followLeader':
            this.changePaintOpacity(true);
            this.drawText('Follow Leader:', rect.x + 4, rect.y, labelWidth);
            this.changeTextColor(this._followLeader ? this.systemColor() : ColorManager.normalColor());
            // Fix: Move ON/OFF text 30px to the right
            this.drawText(this._followLeader ? 'ON' : 'OFF', rect.x + labelWidth + 30, rect.y, rect.width - labelWidth - 34);
            this.resetTextColor();
            break;
        case 'create':
        case 'join':
        case 'disconnect':
        case 'teleportToLeader': // Fix 2: Add teleportToLeader case for proper visibility
            this.changePaintOpacity(isEnabled);
            this.changeTextColor(isEnabled ? this.systemColor() : ColorManager.normalColor());
            this.drawText(this._list[index].name, rect.x + 4, rect.y, rect.width - 8, 'center');
            this.resetTextColor();
            this.changePaintOpacity(true);
            break;
    }
}

    processOk() {
        const symbol = this.currentSymbol();
        const isEnabled = this._list[this.index()] ? this._list[this.index()].enabled : false;
        
        if (!isEnabled) {
            SoundManager.playBuzzer();
            return;
        }
        
        SoundManager.playOk();
        
        switch(symbol) {
            case 'serverUrl':
                if (!NetworkManager.instance.isMultiplayer()) this.editServerUrl();
                else SoundManager.playBuzzer();
                return;
            case 'roomCode':
                if (!NetworkManager.instance.isMultiplayer()) this.editRoomCode();
                else SoundManager.playBuzzer();
                return;
            case 'followLeader':
                this.setFollowLeader(!this._followLeader);
                return;
            case 'teleportToLeader':
                this.callHandler('ok');
            return;
        }
        this.callHandler('ok');
    }

    editServerUrl() {
        const currentUrl = this._serverUrl || '';
        this.startTextInput('Server URL', currentUrl, (result) => {
            if (result !== null) this.setServerUrl(result);
        });
    }

    editRoomCode() {
        const currentCode = this._roomCode || '';
        this.startTextInput('Room Code', currentCode, (result) => {
            if (result !== null) this.setRoomCode(result.substr(0, 5));
        });
    }

    startTextInput(title, initialText, callback) {
        const inputWindow = new Window_TextInput(this.textInputRect(), title, initialText, callback);
        SceneManager._scene.addChild(inputWindow);
        this.deactivate();
    }

    textInputRect() {
        const width = 400, height = 200;
        return new Rectangle((Graphics.boxWidth - width) / 2, (Graphics.boxHeight - height) / 2, width, height);
    }

    activate() { 
        super.activate(); 
        if (NetworkManager.instance) {
            this._followLeader = NetworkManager.instance.followLeader;
        }
        this.refresh(); 
    }
    
    refresh() { this.makeCommandList(); super.refresh(); }
}
    
    class Window_RoomSelection extends Window_Selectable {
        constructor(rect) { super(rect); this._rooms = []; this.refresh(); }
        setRooms(rooms) { this._rooms = rooms || []; this.refresh(); this.select(this._rooms.length > 0 ? 0 : -1); }
        maxItems() { return Math.max(this._rooms.length, 1); }
        currentRoom() { return this._rooms[this.index()]; }
        drawItem(index) {
            if (this._rooms.length === 0) {
                const rect = this.itemLineRect(0);
                this.changePaintOpacity(false);
                this.drawText('No rooms available on this server.', rect.x, rect.y, rect.width, 'center');
                this.changePaintOpacity(true);
                return;
            }
            const room = this._rooms[index];
            if (!room) return;
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            if (index === this.index()) {
                this.changePaintOpacity(false);
                this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, ColorManager.gaugeBackColor());
                this.changePaintOpacity(true);
            }
            this.drawText(room.id, rect.x + 4, rect.y, 150);
            this.drawText(`${room.players}/${MaxPlayers} players`, rect.x + 154, rect.y, rect.width - 154);
        }
        activate() { super.activate(); if (this._rooms.length > 0 && this.index() < 0) this.select(0); }
        isOkEnabled() { return this._rooms.length > 0; }
        processOk() { if (this.isOkEnabled()) super.processOk(); else SoundManager.playBuzzer(); }
    }
    
    class Window_TextInput extends Window_Base {
        constructor(rect, title, initialText, callback) { super(rect); this._title = title; this._text = initialText || ''; this._callback = callback; this._cursor = this._text.length; this._active = true; this.refresh(); }
        refresh() {
            this.contents.clear();
            this.changeTextColor(this.systemColor());
            this.drawText(this._title, 0, 0, this.contentsWidth(), 'center');
            this.resetTextColor();
            const inputY = this.lineHeight() + 10;
            const inputHeight = this.lineHeight() + 8;
            this.contents.fillRect(4, inputY, this.contentsWidth() - 8, inputHeight, ColorManager.gaugeBackColor());
            this.drawText(this._text, 8, inputY + 4, this.contentsWidth() - 16);
            if (this._active && Graphics.frameCount % 40 < 20) {
                const cursorX = 8 + this.textWidth(this._text.substr(0, this._cursor));
                this.contents.fillRect(cursorX, inputY + 4, 2, this.lineHeight(), ColorManager.normalColor());
            }
            this.drawText('Enter: Confirm | Escape: Cancel', 0, this.contentsHeight() - this.lineHeight(), this.contentsWidth(), 'center');
        }
        update() {
            super.update();
            if (!this._active) return;
            if (Input.isTriggered('ok')) { SoundManager.playOk(); this.close(); }
            else if (Input.isTriggered('cancel')) { SoundManager.playCancel(); this._text = null; this.close(); }
        }
        close() { this._active = false; if (this._callback) this._callback(this._text); if (this.parent) this.parent.removeChild(this); if (SceneManager._scene instanceof Scene_Multiplayer) SceneManager._scene._inputWindow.activate(); }
    }

    class Window_MultiplayerStatus extends Window_Base {
        constructor(rect) { super(rect); this.refresh(); }
        refresh() {
            this.contents.clear();
            const nm = NetworkManager.instance;
            this.changeTextColor(this.systemColor());
            this.drawText('Status', 0, 0, this.contentsWidth(), 'center');
            this.resetTextColor();
            let y = this.lineHeight() + 8;
            if (nm.isMultiplayer() || nm.isConnecting()) {
                if (nm.isMultiplayer()) {
                    this.drawText(`Room: ${nm.roomId}`, 4, y, this.contentsWidth());
                    y += this.lineHeight();
                    this.drawText(`Players: ${nm.players.size}/${MaxPlayers}`, 4, y, this.contentsWidth());
                    y += this.lineHeight();
                    if (nm.isLeader) {
                        this.changeTextColor(this.systemColor());
                        this.drawText('You are Leader', 4, y, this.contentsWidth());
                        this.resetTextColor();
                    } else {
                        this.drawText(`Leader: Player ${nm.getCurrentLeaderId()}`, 4, y, this.contentsWidth());
                    }
                } else if (nm.isConnecting()) { this.drawText('Connecting...', 4, y, this.contentsWidth()); }
                if (nm._reconnectAttempt) { y += this.lineHeight(); this.drawText('Reconnecting...', 4, y, this.contentsWidth()); }
            } else { this.drawText('Not connected', 4, y, this.contentsWidth()); }
        }
    }
    
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
            if (sprite.parent) {
                this.removeChild(sprite);
            }
        }
        this._bustSprites = [];
        
        if (!NetworkManager.instance.isMultiplayer()) return;

        const players = Array.from(NetworkManager.instance.players.values());
        const bustSize = 64;
        const itemHeight = Math.max(this.lineHeight() * 2, bustSize);
        
        this.height = this.fittingHeight(players.length);
        this.createContents();

        players.forEach((player, index) => {
            if (!player) return;
            const y = index * (itemHeight + 8);
            
            const bustPath = this.getBustImageForCharacter(player.characterName, player.characterIndex);
            
            if (bustPath) {
                try {
                    const bustSprite = new Sprite();
                    const fallbackBitmap = ImageManager.loadBitmap('img/busts/', '7');
                    bustSprite.bitmap = ImageManager.loadBitmap('img/', bustPath);
                    bustSprite.bitmap.addLoadListener(() => {
                        // Check if the image loaded successfully
                        if (bustSprite.bitmap.width > 0 && bustSprite.bitmap.height > 0) {
                            const scale = Math.min(bustSize / bustSprite.bitmap.width, bustSize / bustSprite.bitmap.height);
                            bustSprite.scale.set(scale);
                            bustSprite.x = 0;
                            bustSprite.y = y;
                        } else {
                            // Use fallback if primary image failed
                            bustSprite.bitmap = fallbackBitmap;
                            fallbackBitmap.addLoadListener(() => {
                                if (fallbackBitmap.width > 0 && fallbackBitmap.height > 0) {
                                    const scale = Math.min(bustSize / fallbackBitmap.width, bustSize / fallbackBitmap.height);
                                    bustSprite.scale.set(scale);
                                    bustSprite.x = 0;
                                    bustSprite.y = y;
                                }
                            });
                        }
                    });

                    bustSprite.bitmap.addErrorListener(() => {
                        // Use fallback on error
                        bustSprite.bitmap = fallbackBitmap;
                        fallbackBitmap.addLoadListener(() => {
                            if (fallbackBitmap.width > 0 && fallbackBitmap.height > 0) {
                                const scale = Math.min(bustSize / fallbackBitmap.width, bustSize / fallbackBitmap.height);
                                bustSprite.scale.set(scale);
                                bustSprite.x = 0;
                                bustSprite.y = y;
                            }
                        });
                    });

                    this.addChild(bustSprite);
                    this._bustSprites.push(bustSprite);

                    this.drawText(player.name, bustSize + 10, y, this.contentsWidth() - bustSize - 10);
                } catch (err) {
                    this.drawFace(player.faceName, player.faceIndex, 0, y, bustSize, bustSize);
                    this.drawText(player.name, bustSize + 10, y, this.contentsWidth() - bustSize - 10);
                }
            } else {
                this.drawFace(player.faceName, player.faceIndex, 0, y, bustSize, bustSize);
                this.drawText(player.name, bustSize + 10, y, this.contentsWidth() - bustSize - 10);
            }
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
    // Plugin Command
    //=============================================================================
    PluginManager.registerCommand(PLUGIN_NAME, 'openConnectionsMenu', () => {
        SceneManager.push(Scene_Multiplayer);
    });

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
    const _Game_SelfSwitches_setValue = Game_SelfSwitches.prototype.setValue;
    Game_SelfSwitches.prototype.setValue = function(key, value, fromNetwork = false) {
        const oldValue = this.value(key);
        _Game_SelfSwitches_setValue.call(this, key, value);
        
        if (!fromNetwork && oldValue !== value) {
            const [mapId, eventId, switchType] = key;
            NetworkManager.instance.onSelfSwitchChange(mapId, eventId, switchType, value);
        }
    };
    
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
        const wh = 100;
        const wx = 10;
        const wy = 100;
        return new Rectangle(wx, wy, ww, wh);
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

    const _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement = function() {
        if (NetworkManager.instance.isMultiplayer() && !NetworkManager.instance.isLeader) {
            if (this.event().name === 'Enemy') {
                if (!this.isMoving()) {
                    _Game_Event_updateSelfMovement.call(this);
                }
                return; 
            }
            return;
        }
    
        const oldX = this.x;
        const oldY = this.y;
        const oldDirection = this.direction();
    
        _Game_Event_updateSelfMovement.call(this);
        /*
        if (NetworkManager.instance.isMultiplayer() && this.event().name === 'Enemy' &&
            (oldX !== this.x || oldY !== this.y || oldDirection !== this.direction())) {
            MultiplayerManager.instance.syncEnemyPosition(this.eventId(), this.x, this.y, this.direction());
        }*/
    };

    const _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        _Game_Player_refresh.call(this);
        if (NetworkManager.instance.isMultiplayer()) {
            const networkManager = NetworkManager.instance;
            const myId = networkManager.myId;
            const myInfo = networkManager.players.get(myId);
            if (myId && myInfo) {
                const newInfo = networkManager.createPlayerInfo();
                if (JSON.stringify(myInfo) !== JSON.stringify(newInfo)) {
                    networkManager.players.set(myId, newInfo);
                    networkManager.broadcast({ type: 'player-meta', info: newInfo });
                }
            }
        }
    };

    const _Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
    Game_Interpreter.prototype.command301 = function(params) {
        if (NetworkManager.instance.isMultiplayer() && !BattleManager.isBattleTest()) {
            NetworkManager.instance.broadcast({ type: 'player-state-change', from: NetworkManager.instance.myId, state: 'battling' });

            const originalCallback = this._branch[this._indent];
            this._branch[this._indent] = (result) => {
                NetworkManager.instance.broadcast({ type: 'player-state-change', from: NetworkManager.instance.myId, state: 'idle' });
                if(originalCallback) {
                    originalCallback(result);
                }
            };
        }
        return _Game_Interpreter_command301.call(this, params);
    };

    //=============================================================================
    // Menu Integration
    //=============================================================================
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand("Multiplayer", "multiplayer", true, 44);
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("multiplayer", this.commandMultiplayer.bind(this));
    };

    Scene_Menu.prototype.commandMultiplayer = function() {
        SceneManager.push(Scene_Multiplayer);
    };

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

    NetworkManager.instance.excludeSelfSwitchSync = function(mapId, eventId) {
        const excludeKey = `${mapId}_${eventId}`;
        this.excludedSelfSwitches.add(excludeKey);
    };

    NetworkManager.instance.includeSelfSwitchSync = function(mapId, eventId) {
        const excludeKey = `${mapId}_${eventId}`;
        this.excludedSelfSwitches.delete(excludeKey);
    };
})();


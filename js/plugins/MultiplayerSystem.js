//=============================================================================
// MultiplayerSystem_Unified.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v6.0.0 - Combined Multiplayer System (Server + Steamworks).
 * @author Omni-Lex (Merged Architecture)
 * @help
 * This plugin unifies the 50-player Central Server architecture (with Party System)
 * and the 8-player Steamworks P2P architecture into a single plugin.
 *
 * --- SETUP ---
 * 1. Choose your "Network Mode" in the plugin parameters.
 * 2. Create events named "Player1" through "Player50" (or Max Players) on your maps.
 * 3. For Steamworks mode, ensure steamworks.js is installed in your NW.js environment
 *    and Steam is running (App ID 4193010).
 * 4. For Server mode, ensure your custom WebSocket server is running.
 *
 * @param networkMode
 * @text Network Mode
 * @desc Choose between 'WebSocket' (Server with Parties) or 'Steamworks' (P2P Lobby).
 * @type select
 * @option WebSocket
 * @option Steamworks
 * @default WebSocket
 *
 * @param serverUrl
 * @text Server URL (WebSocket Only)
 * @desc The WebSocket URL for the central game server.
 * @default https://hypernet-explorer-signaling-server.onrender.com
 *
 * @param maxPlayers
 * @text Maximum Players
 * @desc Maximum players allowed (Server: up to 50, Steamworks: up to 8).
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
 */

/*~struct~Nameplate:
 * @param fontFace
 * @text Font Face
 * @default GameFont
 * @param fontSize
 * @text Font Size
 * @type number
 * @min 1
 * @default 18
 * @param textColor
 * @text Text Color
 * @default #FFFFFF
 * @param outlineColor
 * @text Outline Color
 * @default rgba(0, 0, 0, 0.7)
 * @param outlineWidth
 * @text Outline Width
 * @type number
 * @min 0
 * @default 3
 * @param yOffset
 * @text Y Offset
 * @type number
 * @default -50
 * @min -100
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'MultiplayerSystem_Unified';
    const params = PluginManager.parameters(PLUGIN_NAME);

    let NetworkMode = params.networkMode || 'WebSocket';
    window.NetworkMode = NetworkMode;
    const MaxPlayers = Number(params.maxPlayers || (NetworkMode === 'Steamworks' ? 8 : 50));
    const ExcludedSwitches = (params.excludedSwitches || '').split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    const ExcludedVariables = (params.excludedVariables || '').split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    const ShowPlayerNames = params.showPlayerNames === 'true';
    const NameplateConfig = JSON.parse(params.nameplateConfig || '{}');

    // ============================================================================
    // STEAMWORKS INITIALIZATION
    // ============================================================================
    let steamworks = null;
    let steamClient = null;

    function initSteam() {
        if (steamClient) return true;
        try {
            steamworks = require('../libs/steamworks');
            steamClient = steamworks.init(4193010);
            console.log('Steamworks initialized successfully for User:', steamClient.localplayer.getName());
            // Re-initialize manager if needed
            if (NetworkManager_Steam._instance) {
                NetworkManager_Steam._instance.setupSteamCallbacks();
            }
            return true;
        } catch (e) {
            console.error('Failed to initialize steamworks.js. Is Steam running?', e);
            return false;
        }
    }

    if (NetworkMode === 'Steamworks') {
        initSteam();
    }

    // ============================================================================
    // COMMON: OfflineStateManager
    // ============================================================================
    class OfflineStateManager {
        constructor() { this.savedState = null; }

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
            return this.savedState;
        }

        captureAllSwitches() {
            const switches = {};
            for (let i = 1; i < $dataSystem.switches.length; i++) switches[i] = $gameSwitches.value(i);
            return switches;
        }

        captureAllVariables() {
            const variables = {};
            for (let i = 1; i < $dataSystem.variables.length; i++) variables[i] = $gameVariables.value(i);
            return variables;
        }

        restoreState(restorePosition = true) {
            if (!this.savedState) return false;
            for (const id in this.savedState.switches) $gameSwitches.setValue(Number(id), this.savedState.switches[id], true);
            for (const id in this.savedState.variables) $gameVariables.setValue(Number(id), this.savedState.variables[id], true);

            if (this.savedState.dungeonFloors !== null) $gameSystem._dungeonFloors = JSON.parse(JSON.stringify(this.savedState.dungeonFloors));
            if (this.savedState.stairLocations !== null) $gameSystem._stairLocations = JSON.parse(JSON.stringify(this.savedState.stairLocations));

            if (restorePosition) {
                if ($gameMap.mapId() !== this.savedState.mapId) {
                    $gamePlayer.reserveTransfer(this.savedState.mapId, this.savedState.x, this.savedState.y, this.savedState.direction, 0);
                } else {
                    $gamePlayer.locate(this.savedState.x, this.savedState.y);
                    $gamePlayer.setDirection(this.savedState.direction);
                }
            }
            this.clearState();
            return true;
        }

        clearState() { this.savedState = null; }
    }


    // ============================================================================
    // MODE: WEBSOCKET (SERVER ARCHITECTURE WITH PARTY SYSTEM)
    // ============================================================================
    class NetworkManager_Server {
        constructor() {
            this.ws = null;
            this.myId = null;
            this.players = new Map();
            this.party = null;
            this.currentServerUrl = '';
            this.lastPlayerState = {};
            this.offlineStateManager = new OfflineStateManager();
        }

        static get instance() {
            if (!this._instance) this._instance = new NetworkManager_Server();
            return this._instance;
        }

        pollPackets() { } // Steam stub

        static refreshPlayerListUI() {
            const scene = SceneManager._scene;
            if (scene instanceof Scene_Map && scene._playerListWindow) scene._playerListWindow.refresh();
        }

        isConnected() { return this.ws && this.ws.readyState === WebSocket.OPEN; }
        isMultiplayer() { return !!this.myId; }
        isInParty() { return !!this.party; }
        isConnecting() { return this.ws && this.ws.readyState === WebSocket.CONNECTING; }

        connect(serverUrl) {
            return new Promise((resolve, reject) => {
                this.offlineStateManager.saveCurrentState();
                if (this.ws && this.ws.readyState !== WebSocket.CLOSED) this.ws.close();

                this.currentServerUrl = serverUrl;
                this.ws = new WebSocket(serverUrl);
                NetworkManager_Server.updateUI("Connecting to server...", false);

                this.ws.onopen = () => {
                    this.send({ type: 'login', playerInfo: this.createPlayerInfo() });
                    resolve();
                };
                this.ws.onmessage = (message) => this.handleServerMessage(JSON.parse(message.data));
                this.ws.onerror = (error) => {
                    NetworkManager_Server.updateUI("Failed to connect to server.", true);
                    this.handleDisconnection(true);
                    reject(error);
                };
                this.ws.onclose = () => this.handleDisconnection(true);
            });
        }

        handleDisconnection(restoreLocalState) {
            if (restoreLocalState && this.myId) this.offlineStateManager.restoreState(true);
            this.cleanup();
            NetworkManager_Server.updateUI("Disconnected.", false);
        }

        cleanup() {
            if (this.ws) {
                this.ws.onopen = null;
                this.ws.onmessage = null;
                this.ws.onerror = null;
                this.ws.onclose = null;
                if (this.ws.readyState === WebSocket.OPEN) this.ws.close();
                this.ws = null;
            }
            this.players.clear();
            MultiplayerManager.instance.clearRemotePlayers();
            NetworkManager_Server.refreshPlayerListUI();
            this.myId = null;
            this.party = null;
            this.lastPlayerState = {};
            $gameSwitches.setValue(66, false, true);
        }

        disconnect(restoreState = true) {
            NetworkManager_Server.updateUI("Disconnecting...", false);
            this.handleDisconnection(restoreState);
        }

        send(data) {
            if (this.isConnected()) this.ws.send(JSON.stringify(data));
        }

        static updateUI(text, isError = false) {
            const scene = SceneManager._scene;
            if (scene && scene.updateStatus) scene.updateStatus(text, isError);
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
                    this.players.set(this.myId, this.createPlayerInfo());
                    this.applyFullGameState(data.gameState.switches, data.gameState.variables);
                    for (const player of data.players) {
                        if (player.id !== this.myId) this.players.set(player.id, player.info);
                    }
                    this.offlineStateManager.clearState();
                    const scene = SceneManager._scene;
                    if (scene && scene.onConnectionSuccess) scene.onConnectionSuccess();
                    NetworkManager_Server.refreshPlayerListUI();
                    break;
                case 'player-joined':
                    this.players.set(data.playerId, data.playerInfo);
                    MultiplayerManager.instance.handlePlayerMapTransfer(data.playerId, data.playerInfo.mapId);
                    NetworkManager_Server.refreshPlayerListUI();
                    break;
                case 'player-left':
                    this.players.delete(data.playerId);
                    MultiplayerManager.instance.removeRemotePlayer(data.playerId);
                    NetworkManager_Server.refreshPlayerListUI();
                    break;
                case 'player-move':
                    if (data.from !== this.myId) this.updateRemotePlayer(data.from, data);
                    break;
                case 'player-meta':
                    if (data.from !== this.myId) this.updatePlayerInfo(data.from, data.info);
                    break;
                case 'map-transfer':
                    if (data.from !== this.myId) {
                        const playerInfo = this.players.get(data.from);
                        if (playerInfo) playerInfo.mapId = data.mapId;
                        MultiplayerManager.instance.handlePlayerMapTransfer(data.from, data.mapId);
                    }
                    break;
                case 'switch-change':
                    $gameSwitches.setValue(data.id, data.value, true);
                    break;
                case 'variable-change':
                    $gameVariables.setValue(data.id, data.value, true);
                    break;
                case 'player-state-change':
                    if (data.from !== this.myId) MultiplayerManager.instance.updateRemotePlayerState(data.from, data.state);
                    break;
                case 'party-invite-request':
                    PartyUIManager.instance.showInvitation(data.fromId, data.fromName);
                    break;
                case 'party-update':
                    this.party = data.party;
                    NetworkManager_Server.refreshPlayerListUI();
                    MultiplayerManager.instance.setupPlayerEvents();
                    if (SceneManager._scene && SceneManager._scene.refreshWindows) SceneManager._scene.refreshWindows();
                    break;
                case 'party-disband':
                    this.party = null;
                    NetworkManager_Server.refreshPlayerListUI();
                    MultiplayerManager.instance.setupPlayerEvents();
                    if (SceneManager._scene && SceneManager._scene.refreshWindows) SceneManager._scene.refreshWindows();
                    break;
                case 'force-teleport':
                    if (this.isInParty() && this.myId !== this.party.leaderId) {
                        $gamePlayer.reserveTransfer(data.mapId, data.x, data.y, data.direction, 2);
                    }
                    break;
            }
        }

        applyFullGameState(switches, variables) {
            for (const id in switches) if (!ExcludedSwitches.includes(Number(id))) $gameSwitches.setValue(Number(id), switches[id], true);
            for (const id in variables) if (!ExcludedVariables.includes(Number(id))) $gameVariables.setValue(Number(id), variables[id], true);
        }

        updateRemotePlayer(playerId, data) { MultiplayerManager.instance.updateRemotePlayerPosition(playerId, data); }

        updatePlayerInfo(playerId, info) {
            this.players.set(playerId, info);
            MultiplayerManager.instance.updateRemotePlayerGraphic(playerId, info.characterName, info.characterIndex);
            NetworkManager_Server.refreshPlayerListUI();
        }

        onSwitchChange(switchId, value) {
            if (this.isMultiplayer() && !ExcludedSwitches.includes(switchId)) this.send({ type: 'switch-change', id: switchId, value: value });
        }

        onVariableChange(variableId, value) {
            if (this.isMultiplayer() && !ExcludedVariables.includes(variableId)) this.send({ type: 'variable-change', id: variableId, value: value });
        }

        sendPartyInvite(targetId) { this.send({ type: 'party-invite', targetId: targetId }); }
        sendPartyAccept(inviterId) { this.send({ type: 'party-accept', inviterId: inviterId }); }
        sendPartyLeave() { this.send({ type: 'party-leave' }); }

        updateLocalPlayerPosition() {
            if (!this.isMultiplayer() || !$gamePlayer) return;
            const player = $gamePlayer;
            const lastState = this.lastPlayerState;
            const hasChanged = lastState.x !== player.x || lastState.y !== player.y || lastState.direction !== player.direction() || lastState.pattern !== player.pattern();

            if (hasChanged) {
                const newState = { x: player.x, y: player.y, direction: player.direction(), pattern: player.pattern(), moveSpeed: player.realMoveSpeed() };
                this.send({ type: 'player-move', ...newState });
                this.lastPlayerState = newState;
            }
        }

        onMapTransfer() {
            if (this.isMultiplayer()) {
                this.send({ type: 'map-transfer', mapId: $gameMap.mapId() });
                const myInfo = this.players.get(this.myId);
                if (myInfo) myInfo.mapId = $gameMap.mapId();
            }
        }
    }


    // ============================================================================
    // MODE: STEAMWORKS (P2P LOBBY ARCHITECTURE)
    // ============================================================================
    class NetworkManager_Steam {
        constructor() {
            this.myId = null;
            this.mySteamId = steamClient ? steamClient.localplayer.getSteamId().steamId64.toString() : null;
            this.roomId = null;
            this.isLeader = false;
            this.players = new Map();
            this.steamToInternalId = new Map();
            this.internalToSteamId = new Map();
            this.pendingTeleport = false;
            this.lastPlayerState = {};
            this.followLeader = true;
            this.offlineStateManager = new OfflineStateManager();
            this.leaderQueue = [];
            this.excludedSelfSwitches = new Set();
            this.lobby = null;

            if (steamClient) this.setupSteamCallbacks();
        }

        static get instance() {
            if (!this._instance) this._instance = new NetworkManager_Steam();
            return this._instance;
        }

        setupSteamCallbacks() {
            steamClient.callback.networking.onP2PSessionRequest((request) => {
                steamClient.networking.acceptP2PSessionWithUser(request.remote);
            });
            steamClient.callback.matchmaking.onLobbyChatUpdate((update) => {
                if (update.userChanged.steamId64.toString() !== this.mySteamId) {
                    if (update.memberStateChange === steamworks.ChatMemberStateChange.Entered) {
                        this.handlePlayerJoinedLobby(update.userChanged.steamId64.toString());
                    } else if (update.memberStateChange === steamworks.ChatMemberStateChange.Left || update.memberStateChange === steamworks.ChatMemberStateChange.Disconnected) {
                        this.handlePlayerLeftLobby(update.userChanged.steamId64.toString());
                    }
                }
            });
        }

        static refreshPlayerListUI() {
            const scene = SceneManager._scene;
            if (scene instanceof Scene_Map && scene._playerListWindow) scene._playerListWindow.refresh();
        }

        isConnected() { return !!this.roomId; }
        isMultiplayer() { return !!this.myId; }
        isInParty() { return false; } // Steamworks mode doesn't use the party subset system

        requestLeaderTeleport() {
            if (!this.isMultiplayer() || this.isLeader) return;
            const leaderId = this.getCurrentLeaderId();
            if (leaderId) this.sendTo(leaderId, { type: 'request-teleport' });
        }

        sendTeleportPosition(playerId) {
            if (!this.isLeader || !$gamePlayer) return;
            this.sendTo(playerId, { type: 'teleport-position', mapId: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y, direction: $gamePlayer.direction() });
        }

        static updateUI(text, isError = false) {
            const scene = SceneManager._scene;
            if (scene && scene.updateStatus) scene.updateStatus(text, isError);
        }

        async initiateCreateRoom(followLeader = true) {
            if (!steamClient) return;
            try {
                this.offlineStateManager.saveCurrentState();
                this.isLeader = true;
                this.myId = 1;
                this.followLeader = followLeader;
                NetworkManager_Steam.updateUI("Creating Steam Lobby...");
                this.lobby = await steamClient.matchmaking.createLobby(steamworks.LobbyType.FriendsOnly, MaxPlayers);
                this.roomId = this.lobby.id.toString();

                this.players.set(this.myId, this.createPlayerInfo());
                this.steamToInternalId.set(this.mySteamId, this.myId);
                this.internalToSteamId.set(this.myId, this.mySteamId);
                this.leaderQueue = [this.myId];

                if (SceneManager._scene && SceneManager._scene.onRoomSetupSuccess) SceneManager._scene.onRoomSetupSuccess(true);
            } catch (e) {
                NetworkManager_Steam.updateUI("Failed to create Steam Lobby.", true);
                this.offlineStateManager.clearState();
            }
        }

        async initiateJoinRoom(roomId, followLeader = true) {
            if (!steamClient) return;
            try {
                this.offlineStateManager.saveCurrentState();
                this.isLeader = false;
                this.followLeader = followLeader;
                NetworkManager_Steam.updateUI(`Joining Steam Lobby ${roomId}...`);
                this.lobby = await steamClient.matchmaking.joinLobby(BigInt(roomId));
                this.roomId = this.lobby.id.toString();

                const ownerId = steamClient.matchmaking.getLobbyOwner(this.lobby.id).steamId64.toString();
                steamClient.networking.acceptP2PSessionWithUser(BigInt(ownerId));
                this.sendToSteamId(ownerId, { type: 'join-request', steamId: this.mySteamId, playerInfo: this.createPlayerInfo() });
            } catch (e) {
                NetworkManager_Steam.updateUI(`Failed to join lobby ${roomId}.`, true);
                this.offlineStateManager.clearState();
            }
        }

        handlePlayerJoinedLobby(steamId) {
            if (this.isLeader) {
                let assignedId = 2;
                while (this.internalToSteamId.has(assignedId) && assignedId <= MaxPlayers) assignedId++;
                if (assignedId <= MaxPlayers) {
                    this.steamToInternalId.set(steamId, assignedId);
                    this.internalToSteamId.set(assignedId, steamId);
                }
            }
        }

        handlePlayerLeftLobby(steamId) {
            const internalId = this.steamToInternalId.get(steamId);
            if (internalId) this.handlePlayerDisconnect(internalId);
        }

        pollPackets() {
            if (!steamClient || !this.roomId) return;
            while (steamClient.networking.isP2PPacketAvailable(0)) {
                const packet = steamClient.networking.readP2PPacket(0);
                try {
                    const data = JSON.parse(packet.data.toString('utf8'));
                    const senderSteamId = packet.remote.steamId64.toString();
                    if (data.type === 'join-request' && this.isLeader) {
                        this.handleJoinRequest(senderSteamId, data.playerInfo);
                    } else if (data.type === 'room-joined') {
                        this.handleRoomJoined(data);
                    } else {
                        const fromId = this.steamToInternalId.get(senderSteamId);
                        if (fromId) this.handleGameMessage(fromId, data);
                    }
                } catch (e) { }
            }
        }

        handleJoinRequest(steamId, playerInfo) {
            const internalId = this.steamToInternalId.get(steamId);
            if (!internalId) return;

            this.players.set(internalId, playerInfo);
            this.leaderQueue.push(internalId);

            const otherPlayers = [];
            for (const [id, info] of this.players.entries()) {
                if (id !== internalId) otherPlayers.push({ id, steamId: this.internalToSteamId.get(id), info });
            }

            this.sendToSteamId(steamId, { type: 'room-joined', yourId: internalId, leaderId: this.myId, otherPlayers: otherPlayers });
            this.broadcast({ type: 'player-joined', playerId: internalId, steamId: steamId, playerInfo: playerInfo }, internalId);
            this.sendFullGameState(internalId);
            this.sendLeaderPosition(internalId);
            NetworkManager_Steam.refreshPlayerListUI();
        }

        handleRoomJoined(data) {
            this.myId = data.yourId;
            this.steamToInternalId.set(this.mySteamId, this.myId);
            this.internalToSteamId.set(this.myId, this.mySteamId);
            this.players.set(this.myId, this.createPlayerInfo());

            this.leaderQueue = [data.leaderId];
            for (const p of data.otherPlayers) {
                this.players.set(p.id, p.info);
                this.steamToInternalId.set(p.steamId, p.id);
                this.internalToSteamId.set(p.id, p.steamId);
                if (p.id !== data.leaderId) this.leaderQueue.push(p.id);
                steamClient.networking.acceptP2PSessionWithUser(BigInt(p.steamId));
            }
            this.leaderQueue.push(this.myId);
            NetworkManager_Steam.refreshPlayerListUI();
            if (SceneManager._scene && SceneManager._scene.onRoomSetupSuccess) SceneManager._scene.onRoomSetupSuccess(false);
        }

        getCurrentLeaderId() { return this.leaderQueue.length > 0 ? this.leaderQueue[0] : null; }

        handlePlayerDisconnect(playerId) {
            const steamId = this.internalToSteamId.get(playerId);
            this.steamToInternalId.delete(steamId);
            this.internalToSteamId.delete(playerId);
            this.players.delete(playerId);

            const leaderIndex = this.leaderQueue.indexOf(playerId);
            if (leaderIndex !== -1) this.leaderQueue.splice(leaderIndex, 1);

            MultiplayerManager.instance.removeRemotePlayer(playerId);
            NetworkManager_Steam.refreshPlayerListUI();

            if (playerId === this.getCurrentLeaderId() && this.leaderQueue.length > 0) this.handleLeaderHandoff();
            if (this.players.size === 1 && this.players.has(this.myId)) this.handleLastPlayer();
        }

        handleLeaderHandoff() {
            const newLeaderId = this.getCurrentLeaderId();
            if (newLeaderId === this.myId) {
                this.isLeader = true;
                this.broadcast({ type: 'leader-change', newLeaderId: this.myId });
                for (const playerId of this.players.keys()) if (playerId !== this.myId) this.sendFullGameState(playerId);
            }
        }

        handleLastPlayer() {
            this.offlineStateManager.restoreState(false);
            MultiplayerManager.instance.clearRemotePlayers();
        }

        cleanup() {
            if (this.lobby && steamClient) steamClient.matchmaking.leaveLobby(BigInt(this.roomId));
            this.players.clear();
            this.steamToInternalId.clear();
            this.internalToSteamId.clear();
            this.leaderQueue = [];
            MultiplayerManager.instance.clearRemotePlayers();
            NetworkManager_Steam.refreshPlayerListUI();
            this.myId = null;
            this.roomId = null;
            this.lobby = null;
            this.isLeader = false;
            this.pendingTeleport = false;
            this.lastPlayerState = {};
            this.offlineStateManager.clearState();
            $gameSwitches.setValue(66, false);
        }

        disconnect(restoreState = true) {
            if (restoreState && this.myId) this.offlineStateManager.restoreState(true);
            this.cleanup();
        }

        broadcast(data, excludeInternalId = null) {
            if (!this.isMultiplayer() || !steamClient) return;
            const buffer = Buffer.from(JSON.stringify(data), 'utf8');
            for (const [internalId, steamId] of this.internalToSteamId.entries()) {
                if (internalId !== this.myId && internalId !== excludeInternalId) steamClient.networking.sendP2PPacket(BigInt(steamId), buffer, steamworks.SendType.Reliable, 0);
            }
        }

        sendTo(internalId, data) {
            if (!this.isMultiplayer() || !steamClient) return;
            const steamId = this.internalToSteamId.get(internalId);
            if (steamId) steamClient.networking.sendP2PPacket(BigInt(steamId), Buffer.from(JSON.stringify(data), 'utf8'), steamworks.SendType.Reliable, 0);
        }

        sendToSteamId(steamId, data) {
            if (!steamClient) return;
            steamClient.networking.sendP2PPacket(BigInt(steamId), Buffer.from(JSON.stringify(data), 'utf8'), steamworks.SendType.Reliable, 0);
        }

        handleGameMessage(fromId, data) {
            data.from = fromId;
            this.processGameMessage(data);
            if (this.isLeader && data.type !== 'join-request') this.broadcast(data, fromId);
        }

        handleTeleportPosition(data) {
            if (this.isLeader) return;
            if ($gameMap.mapId() !== data.mapId) {
                this.pendingTeleport = true;
                $gamePlayer.reserveTransfer(data.mapId, data.x, data.y, data.direction, 0);
                $gamePlayer.requestMapReload();
            } else {
                $gamePlayer.locate(data.x, data.y);
                $gamePlayer.setDirection(data.direction);
            }
        }

        processGameMessage(data) {
            switch (data.type) {
                case 'full-state': this.applyFullGameState(data.switches, data.variables); break;
                case 'leader-change': this.handleLeaderChange(data.newLeaderId); break;
                case 'dungeon-data':
                    $gameSystem._dungeonFloors = JSON.parse(JSON.stringify(data.dungeonFloors));
                    $gameSystem._stairLocations = JSON.parse(JSON.stringify(data.stairLocations));
                    $gameSystem._dungeonGenerated = data.dungeonGenerated || true;
                    $gameSystem._mapRegion13Cache = JSON.parse(JSON.stringify(data.mapRegion13Cache || {}));
                    break;
                case 'leader-position': this.handleLeaderPosition(data); break;
                case 'request-teleport': if (this.isLeader) this.sendTeleportPosition(data.from); break;
                case 'teleport-position': this.handleTeleportPosition(data); break;
                case 'switch-change': $gameSwitches.setValue(data.id, data.value, true); break;
                case 'variable-change': $gameVariables.setValue(data.id, data.value, true); break;
                case 'self-switch-change':
                    if ($gameMap.mapId() === data.mapId) {
                        $gameSelfSwitches.setValue([data.mapId, data.eventId, data.switchType], data.value, true);
                        const event = $gameMap.event(data.eventId);
                        if (event) event.refresh();
                    }
                    break;
                case 'player-move': this.updateRemotePlayer(data.from, data); break;
                case 'player-meta': this.updatePlayerInfo(data.from, data.info); break;
                case 'player-joined':
                    this.players.set(data.playerId, data.playerInfo);
                    this.steamToInternalId.set(data.steamId, data.playerId);
                    this.internalToSteamId.set(data.playerId, data.steamId);
                    this.leaderQueue.push(data.playerId);
                    NetworkManager_Steam.refreshPlayerListUI();
                    break;
                case 'full-self-switches':
                    for (const keyString in data.selfSwitches) {
                        const keyParts = keyString.split(',');
                        $gameSelfSwitches.setValue([parseInt(keyParts[0], 10), parseInt(keyParts[1], 10), keyParts[2]], data.selfSwitches[keyString], true);
                    }
                    break;
                case 'player-state-change': MultiplayerManager.instance.updateRemotePlayerState(data.from, data.state); break;
                case 'map-transfer':
                    const playerInfo = this.players.get(data.from);
                    if (playerInfo) playerInfo.mapId = data.mapId;
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
            if (newLeaderId === this.myId) this.isLeader = true;
        }

        sendLeaderPosition(playerId) {
            if (!this.isLeader || !$gamePlayer) return;
            this.sendTo(playerId, { type: 'leader-position', mapId: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y });
        }

        handleLeaderPosition(data) {
            if (this.isLeader || !this.followLeader) return;
            if ($gameMap.mapId() !== data.mapId) {
                this.pendingTeleport = true;
                $gamePlayer.reserveTransfer(data.mapId, data.x, data.y, 2, 0);
                $gamePlayer.requestMapReload();
            }
        }

        createPlayerInfo() {
            const leader = $gameParty.leader();
            const actor = $gameActors.actor(1);
            return {
                name: steamClient ? steamClient.localplayer.getName() : actor.name(),
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
            MultiplayerManager.instance.updateRemotePlayerGraphic(playerId, info.characterName, info.characterIndex);
            NetworkManager_Steam.refreshPlayerListUI();
        }

        onSwitchChange(switchId, value) {
            if (this.isMultiplayer() && !ExcludedSwitches.includes(switchId)) this.broadcast({ type: 'switch-change', id: switchId, value: value });
        }

        shouldSyncSelfSwitch(mapId, eventId, switchType) {
            const eventName = $dataMap && $dataMap.events && $dataMap.events[eventId] ? $dataMap.events[eventId].name : '';
            if (eventName.match(/^Player\d+$/)) return false;
            return !this.excludedSelfSwitches.has(`${mapId}_${eventId}`);
        }

        onVariableChange(variableId, value) {
            if (this.isMultiplayer() && !ExcludedVariables.includes(variableId)) this.broadcast({ type: 'variable-change', id: variableId, value: value });
        }

        onSelfSwitchChange(mapId, eventId, switchType, value) {
            if (this.isMultiplayer() && this.shouldSyncSelfSwitch(mapId, eventId, switchType)) {
                this.broadcast({ type: 'self-switch-change', mapId: mapId, eventId: eventId, switchType: switchType, value: value });
            }
        }

        sendFullGameState(targetPlayerId) {
            if (!this.isLeader) return;
            const switches = {};
            const variables = {};
            const selfSwitches = {};
            for (let i = 1; i < $dataSystem.switches.length; i++) if (!ExcludedSwitches.includes(i)) switches[i] = $gameSwitches.value(i);
            for (let i = 1; i < $dataSystem.variables.length; i++) if (!ExcludedVariables.includes(i)) variables[i] = $gameVariables.value(i);
            for (const key in $gameSelfSwitches._data) {
                const [mapId, eventId, switchType] = key.split(',').map((v, i) => i < 2 ? parseInt(v) : v);
                if (this.shouldSyncSelfSwitch(mapId, eventId, switchType)) selfSwitches[key] = $gameSelfSwitches._data[key];
            }
            this.sendTo(targetPlayerId, { type: 'full-state', switches, variables });
            this.sendTo(targetPlayerId, { type: 'full-self-switches', selfSwitches: selfSwitches });

            if ($gameSystem._dungeonFloors && $gameSystem._stairLocations && $gameSystem._dungeonGenerated) {
                this.sendTo(targetPlayerId, { type: 'dungeon-data', dungeonFloors: JSON.parse(JSON.stringify($gameSystem._dungeonFloors)), stairLocations: JSON.parse(JSON.stringify($gameSystem._stairLocations)), dungeonGenerated: $gameSystem._dungeonGenerated, mapRegion13Cache: JSON.parse(JSON.stringify($gameSystem._mapRegion13Cache || {})) });
            }

            for (const [id, player] of this.players.entries()) if (id !== targetPlayerId) this.sendTo(targetPlayerId, { type: 'player-meta', from: id, info: player });
        }

        applyFullGameState(switches, variables) {
            for (const id in switches) $gameSwitches.setValue(Number(id), switches[id], true);
            for (const id in variables) $gameVariables.setValue(Number(id), variables[id], true);
        }

        updateLocalPlayerPosition() {
            if (!this.isMultiplayer() || !$gamePlayer) return;
            const player = $gamePlayer;
            const lastState = this.lastPlayerState;
            const hasChanged = lastState.x !== player.x || lastState.y !== player.y || lastState.direction !== player.direction() || lastState.pattern !== player.pattern() || lastState.opacity !== player.opacity();

            if (hasChanged) {
                const newState = { x: player.x, y: player.y, direction: player.direction(), pattern: player.pattern(), moveSpeed: player.realMoveSpeed(), opacity: player.opacity(), blendMode: player.blendMode() };
                const message = { type: 'player-move', ...newState };
                const myMapId = $gameMap.mapId();
                for (const [playerId, playerInfo] of this.players.entries()) {
                    if (playerId === this.myId) continue;
                    if (playerInfo.mapId === myMapId) this.sendTo(playerId, message);
                }
                this.lastPlayerState = newState;
            }
        }

        updateRemotePlayer(playerId, data) { MultiplayerManager.instance.updateRemotePlayerPosition(playerId, data); }

        onMapTransfer() {
            if (this.isMultiplayer()) {
                this.broadcast({ type: 'map-transfer', mapId: $gameMap.mapId() });
                const myInfo = this.players.get(this.myId);
                if (myInfo) myInfo.mapId = $gameMap.mapId();
                if (this.isLeader) setTimeout(() => { for (const playerId of this.players.keys()) if (playerId !== this.myId) this.sendLeaderPosition(playerId); }, 100);
            }
        }
    }


    // Set unified global NetworkManager based on the param
    let NetworkManager = NetworkMode === 'Steamworks' ? NetworkManager_Steam : NetworkManager_Server;
    window.NetworkManager = NetworkManager;


    // ============================================================================
    // COMMON: MultiplayerManager
    // ============================================================================
    class MultiplayerManager {
        constructor() {
            this.playerEvents = new Map();
            this.eventPlayerMap = new Map();
            this.playerMovementQueue = new Map();
        }

        static get instance() {
            if (!this._instance) this._instance = new MultiplayerManager();
            return this._instance;
        }

        update() {
            NetworkManager.instance.pollPackets();
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
                if (nextMove) this.executeMovement(event, nextMove);
            }
        }

        executeMovement(event, moveData) {
            event.setMoveSpeed(moveData.moveSpeed);
            event.setPattern(moveData.pattern || event.pattern());
            if (NetworkMode === 'Steamworks') {
                event.setOpacity(moveData.opacity === undefined ? 255 : moveData.opacity);
                event.setBlendMode(moveData.blendMode === undefined ? 0 : moveData.blendMode);
            }
            const dx = moveData.x - event.x;
            const dy = moveData.y - event.y;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) event.locate(moveData.x, moveData.y);
            else if (dx !== 0 || dy !== 0) {
                const sx = event.deltaXFrom(moveData.x);
                const sy = event.deltaYFrom(moveData.y);
                if (Math.abs(sx) > Math.abs(sy)) event.moveStraight(sx > 0 ? 4 : 6);
                else if (sy !== 0) event.moveStraight(sy > 0 ? 8 : 2);
            }
            event.setDirection(moveData.direction);
        }

        getRemotePlayer(id) { return this.playerEvents.has(id) ? $gameMap.event(this.playerEvents.get(id)) : null; }

        removeRemotePlayer(id) {
            const eventId = this.playerEvents.get(id);
            if (eventId) {
                const event = $gameMap.event(eventId);
                if (event) { event.setOpacity(0); event._characterName = ''; }
                this.playerEvents.delete(id);
                this.eventPlayerMap.delete(eventId);
                this.playerMovementQueue.delete(id);
            }
        }

        clearRemotePlayers() {
            for (const eventId of this.eventPlayerMap.keys()) {
                const event = $gameMap.event(eventId);
                if (event) { event.setOpacity(0); event._characterName = ''; }
            }
            this.playerEvents.clear();
            this.eventPlayerMap.clear();
            this.playerMovementQueue.clear();
        }

        onMapLoaded() {
            if (NetworkManager.instance.isMultiplayer()) {
                NetworkManager.instance.onMapTransfer();
                this.setupPlayerEvents();
                if (NetworkMode === 'Steamworks' && NetworkManager.instance.pendingTeleport && !NetworkManager.instance.isLeader && NetworkManager.instance.followLeader) {
                    NetworkManager.instance.pendingTeleport = false;
                }
            }
        }

        setupPlayerEvents() {
            const MAX_MAP_SLOTS = NetworkMode === 'Steamworks' ? MaxPlayers : 8; // Adjust slots visually
            const playerEventNames = Array.from({ length: MAX_MAP_SLOTS }, (_, i) => `Player${i + 1}`);
            this.playerEvents.clear();
            this.eventPlayerMap.clear();
            this.playerMovementQueue.clear();

            if (!$dataMap.events) return;

            const nm = NetworkManager.instance;
            const myId = nm.myId;
            const currentMapId = $gameMap.mapId();
            const availableSlots = [];

            for (const event of $dataMap.events) {
                if (event && playerEventNames.includes(event.name)) {
                    availableSlots.push(event);
                    const mapEvent = $gameMap.event(event.id);
                    if (mapEvent) { mapEvent.setOpacity(0); mapEvent._characterName = ''; }
                }
            }

            availableSlots.sort((a, b) => parseInt(a.name.replace('Player', '')) - parseInt(b.name.replace('Player', '')));

            const partyMembers = nm.isInParty() ? nm.party.members : [];
            const partyPlayersOnMap = [];
            const otherPlayersOnMap = [];

            for (const [playerId, playerInfo] of nm.players.entries()) {
                if (playerId === myId || !playerInfo || playerInfo.mapId !== currentMapId) continue;
                const playerData = { id: playerId, info: playerInfo };
                if (partyMembers.includes(playerId)) partyPlayersOnMap.push(playerData);
                else otherPlayersOnMap.push(playerData);
            }

            const playersToDisplay = [...partyPlayersOnMap, ...otherPlayersOnMap].slice(0, MAX_MAP_SLOTS);

            for (let i = 0; i < playersToDisplay.length; i++) {
                const player = playersToDisplay[i];
                const eventData = availableSlots[i];
                if (player && eventData) {
                    this.playerEvents.set(player.id, eventData.id);
                    this.eventPlayerMap.set(eventData.id, player.id);
                    this.playerMovementQueue.set(player.id, []);
                    const event = $gameMap.event(eventData.id);
                    if (event) {
                        event._characterName = player.info.characterName;
                        event._characterIndex = player.info.characterIndex;
                        event.locate(player.info.x, player.info.y);
                        event.setDirection(player.info.direction);
                        event.setOpacity(255);
                        event.refresh();
                    }
                }
            }
        }

        updateRemotePlayerPosition(playerId, data) {
            const playerInfo = NetworkManager.instance.players.get(playerId);
            if (playerInfo) { playerInfo.x = data.x; playerInfo.y = data.y; playerInfo.direction = data.direction; }
            const event = this.getRemotePlayer(playerId);
            if (!event) return;
            if (!this.playerMovementQueue.has(playerId)) this.playerMovementQueue.set(playerId, []);

            const queue = this.playerMovementQueue.get(playerId);
            const dx = Math.abs(data.x - event.x);
            const dy = Math.abs(data.y - event.y);

            if (dx > 3 || dy > 3 || queue.length > 8) {
                queue.length = 0;
                event.locate(data.x, data.y);
                this.executeMovement(event, data);
            } else { queue.push(data); }
        }

        updateRemotePlayerGraphic(playerId, characterName, characterIndex) {
            const event = this.getRemotePlayer(playerId);
            if (event) { event._characterName = characterName; event._characterIndex = characterIndex; event.refresh(); }
        }

        handlePlayerMapTransfer(playerId, mapId) {
            const playerInfo = NetworkManager.instance.players.get(playerId);
            if (playerInfo) playerInfo.mapId = mapId;
            if (mapId === $gameMap.mapId()) this.setupPlayerEvents();
            else {
                const event = this.getRemotePlayer(playerId);
                if (event) { event.setOpacity(0); event._characterName = ''; this.playerMovementQueue.delete(playerId); }
            }
        }

        updateRemotePlayerState(playerId, state) {
            const event = this.getRemotePlayer(playerId);
            if (!event) return;
            event.setOpacity(state === 'battling' ? 0 : 255);
        }
    }


    // ============================================================================
    // MENU/UI: COMBINED SCENE
    // ============================================================================
    // ============================================================================
    // Scene_MultiplayerTypeSelection
    // ============================================================================
    class Scene_MultiplayerTypeSelection extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createCommandWindow();
        }

        createHelpWindow() {
            const rect = new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(1, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("Select Multiplayer Mode");
            this.addWindow(this._helpWindow);
        }

        createCommandWindow() {
            const ww = 400;
            const wh = this.calcWindowHeight(3, true);
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            const rect = new Rectangle(wx, wy, ww, wh);
            this._commandWindow = new Window_MultiplayerTypeSelection(rect);
            this._commandWindow.setHandler("local", this.commandLocal.bind(this));
            this._commandWindow.setHandler("steam", this.commandSteam.bind(this));
            this._commandWindow.setHandler("server", this.commandServer.bind(this));
            this._commandWindow.setHandler("disconnectLocal", this.commandDisconnectLocal.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }

        commandLocal() {
            if (typeof Scene_SplitScreenCharacterSelection !== 'undefined') {
                SceneManager.push(Scene_SplitScreenCharacterSelection);
            } else {
                this._commandWindow.activate();
            }
        }

        commandDisconnectLocal() {
            if (window.SplitScreenManager) {
                window.SplitScreenManager.stopSession();
                this._commandWindow.refresh();
                this._commandWindow.activate();
                this._helpWindow.setText("Split-screen session terminated.");
            }
        }

        commandSteam() {
            if (initSteam()) {
                NetworkMode = 'Steamworks';
                window.NetworkMode = NetworkMode;
                NetworkManager = NetworkManager_Steam;
                window.NetworkManager = NetworkManager;
                SceneManager.push(Scene_Multiplayer);
            } else {
                this._helpWindow.setText("Steam initialization failed. Is Steam running?");
                this._commandWindow.activate();
            }
        }

        commandServer() {
            NetworkMode = 'WebSocket';
            window.NetworkMode = NetworkMode;
            NetworkManager = NetworkManager_Server;
            window.NetworkManager = NetworkManager;
            SceneManager.push(Scene_Multiplayer);
        }
    }

    class Window_MultiplayerTypeSelection extends Window_Command {
        makeCommandList() {
            if (window.SplitScreenManager && window.SplitScreenManager.active) {
                this.addCommand("Disconnect Split-Screen", "disconnectLocal");
            } else {
                this.addCommand("Local Multiplayer", "local");
                this.addCommand("Steam Multiplayer", "steam");
                this.addCommand("Custom Server", "server");
            }
        }
    }

    window.Scene_MultiplayerTypeSelection = Scene_MultiplayerTypeSelection;


    class Scene_Multiplayer extends Scene_MenuBase {
        constructor() {
            super();
            this._serverUrl = localStorage.getItem('gmn_mp_serverUrl') || ServerUrl;
            this._roomCode = NetworkManager.instance.roomId || '';
            this._followLeader = localStorage.getItem('gmn_mp_followLeader') !== 'false';
        }

        create() {
            super.create();
            this.createHelpWindow();
            this.createInputWindow();
            this.createStatusWindow();
            if (NetworkMode === 'WebSocket') {
                this.createPlayerListWindow();
                this.createPartyWindow();
            }
            if (NetworkManager.instance.isMultiplayer() && NetworkMode === 'Steamworks') {
                this._helpWindow.setText('Connected to Steam Lobby: ' + NetworkManager.instance.roomId);
            }
        }

        createHelpWindow() {
            const rect = new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(2, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText(`${NetworkMode === 'Steamworks' ? 'Steamworks' : 'Server'} Multiplayer (Max ${MaxPlayers} players)`);
            this.addWindow(this._helpWindow);
        }

        createInputWindow() {
            const ww = Math.floor(Graphics.boxWidth * 0.5);
            const wh = this.calcWindowHeight(6, true);
            const rect = new Rectangle(0, this._helpWindow.y + this._helpWindow.height, ww, wh);
            this._inputWindow = new Window_MultiplayerInput(rect);
            this._inputWindow.setServerUrl(this._serverUrl);
            this._inputWindow.setRoomCode(this._roomCode);
            this._inputWindow.setFollowLeader(this._followLeader);
            this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
            this._inputWindow.setHandler('cancel', this.popScene.bind(this));
            this._inputWindow.activate();
            this.addWindow(this._inputWindow);
        }

        createStatusWindow() {
            const rect = new Rectangle(this._inputWindow.width, this._inputWindow.y, Graphics.boxWidth - this._inputWindow.width, this._inputWindow.height);
            this._statusWindow = new Window_MultiplayerStatus(rect);
            this.addWindow(this._statusWindow);
        }

        createPlayerListWindow() {
            const rect = new Rectangle(0, this._inputWindow.y + this._inputWindow.height, Graphics.boxWidth, Graphics.boxHeight - (this._inputWindow.y + this._inputWindow.height));
            this._playerListWindow = new Window_MultiplayerPlayerList(rect);
            this._playerListWindow.setHandler('invite', this.onInvitePlayer.bind(this));
            this._playerListWindow.setHandler('cancel', this.onPlayerListCancel.bind(this));
            this._playerListWindow.deactivate();
            this._playerListWindow.hide();
            this.addWindow(this._playerListWindow);
        }

        createPartyWindow() {
            const rect = new Rectangle(0, this._inputWindow.y + this._inputWindow.height, Graphics.boxWidth, Graphics.boxHeight - (this._inputWindow.y + this._inputWindow.height));
            this._partyWindow = new Window_MultiplayerParty(rect);
            this._partyWindow.setHandler('leave', this.onLeaveParty.bind(this));
            this._partyWindow.setHandler('cancel', this.onPartyCancel.bind(this));
            this._partyWindow.deactivate();
            this._partyWindow.hide();
            this.addWindow(this._partyWindow);
        }

        onInputOk() {
            const selectedAction = this._inputWindow.currentSymbol();
            if (NetworkMode === 'WebSocket') {
                this._serverUrl = this._inputWindow.serverUrl();
                localStorage.setItem('gmn_mp_serverUrl', this._serverUrl);
                switch (selectedAction) {
                    case 'connect': this.commandConnectServer(); break;
                    case 'disconnect': this.commandDisconnect(); break;
                    case 'players': this.commandPlayerList(); break;
                    case 'party': this.commandPartyMenu(); break;
                }
            } else {
                this._roomCode = this._inputWindow.roomCode();
                this._followLeader = this._inputWindow.followLeader();
                switch (selectedAction) {
                    case 'create': this.commandCreateSteam(); break;
                    case 'join': this.commandJoinSteam(); break;
                    case 'disconnect': this.commandDisconnect(); break;
                    case 'teleportToLeader': this.commandTeleportToLeader(); break;
                }
            }
        }

        commandConnectServer() {
            if (!this._serverUrl) { this.updateStatus('Server URL cannot be empty!', true); return; }
            NetworkManager.instance.connect(this._serverUrl).catch(() => { });
        }

        commandCreateSteam() {
            this._helpWindow.setText('Creating Steam Lobby...');
            NetworkManager.instance.initiateCreateRoom(this._followLeader);
        }

        async commandJoinSteam() {
            if (!this._roomCode) { this.updateStatus('Lobby ID cannot be empty!', true); return; }
            this._helpWindow.setText(`Joining Steam Lobby ${this._roomCode}...`);
            if (NetworkManager.instance.isMultiplayer()) {
                NetworkManager.instance.disconnect(true);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            NetworkManager.instance.initiateJoinRoom(this._roomCode, this._followLeader);
        }

        commandDisconnect() {
            const shouldRestoreState = NetworkMode === 'Steamworks' ? !NetworkManager.instance.isLeader : true;
            NetworkManager.instance.disconnect(shouldRestoreState);
            this._inputWindow.setRoomCode('');
            this._inputWindow.refresh();
            this.updateStatus('Disconnected. Ready to connect.');
        }

        commandTeleportToLeader() {
            const nm = NetworkManager.instance;
            if (!nm.isMultiplayer() || nm.isLeader) { this.updateStatus('Cannot teleport - you are the leader or not connected!', true); return; }
            if (!nm.getCurrentLeaderId()) { this.updateStatus('No leader found to teleport to!', true); return; }
            nm.requestLeaderTeleport();
            this.updateStatus('Teleporting to leader...');
            SoundManager.playOk();
            setTimeout(() => SceneManager.goto(Scene_Map), 1000);
        }

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

        onRoomSetupSuccess(isLeader) {
            if (isLeader) {
                this._roomCode = NetworkManager.instance.roomId;
                this._inputWindow.setRoomCode(this._roomCode);
                this._helpWindow.setText(`Steam Lobby Created: ${this._roomCode}\nShare this ID with friends!`);
            } else { this.updateStatus("Success! Joining game..."); }
            SoundManager.playOk();
            $gameSwitches.setValue(66, true);
            setTimeout(() => SceneManager.goto(Scene_Map), 2000);
        }

        refreshWindows() {
            if (this._statusWindow) this._statusWindow.refresh();
            if (this._inputWindow) this._inputWindow.refresh();
            if (this._playerListWindow) this._playerListWindow.refresh();
            if (this._partyWindow) this._partyWindow.refresh();
        }

        update() {
            super.update();
            NetworkManager.instance.pollPackets();
            this.refreshWindows();
        }
    }


    class Window_MultiplayerInput extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._serverUrl = '';
            this._roomCode = '';
            this._followLeader = true;
            this.refresh();
        }
        maxItems() { return this._list ? this._list.length : 0; }
        serverUrl() { return this._serverUrl; }
        roomCode() { return this._roomCode; }
        followLeader() { return this._followLeader; }

        setServerUrl(url) { this._serverUrl = url || ''; this.refresh(); }
        setRoomCode(code) { this._roomCode = (code || '').toUpperCase(); this.refresh(); }
        setFollowLeader(value) {
            this._followLeader = value;
            localStorage.setItem('gmn_mp_followLeader', this._followLeader);
            if (NetworkManager.instance && NetworkMode === 'Steamworks') NetworkManager.instance.followLeader = this._followLeader;
            this.refresh();
        }
        currentSymbol() { return this._list[this.index()]?.symbol; }

        makeCommandList() {
            const connected = NetworkManager.instance.isMultiplayer();
            this._list = [];

            if (NetworkMode === 'WebSocket') {
                this._list.push({ name: 'Server URL:', symbol: 'serverUrl', enabled: !connected });
                if (connected) {
                    this._list.push({ name: '► Disconnect', symbol: 'disconnect', enabled: true });
                    this._list.push({ name: '► Player List', symbol: 'players', enabled: true });
                    this._list.push({ name: '► Party Menu', symbol: 'party', enabled: true });
                } else {
                    this._list.push({ name: '► Connect', symbol: 'connect', enabled: true });
                }
            } else {
                const isLeader = NetworkManager.instance.isLeader;
                this._list.push({ name: 'Lobby ID:', symbol: 'roomCode', enabled: !connected });
                this._list.push({ name: 'Follow Leader:', symbol: 'followLeader', enabled: true });
                if (connected) {
                    if (!isLeader) this._list.push({ name: '► Teleport to Leader', symbol: 'teleportToLeader', enabled: true });
                    this._list.push({ name: '► Disconnect', symbol: 'disconnect', enabled: true });
                } else {
                    this._list.push({ name: '► Create Steam Lobby', symbol: 'create', enabled: true });
                    this._list.push({ name: '► Join Lobby by ID', symbol: 'join', enabled: true });
                }
            }
        }

        drawItem(index) {
            const item = this._list[index];
            if (!item) return;
            const rect = this.itemLineRect(index);
            const labelWidth = 150;
            this.changePaintOpacity(item.enabled);
            this.resetTextColor();

            switch (item.symbol) {
                case 'serverUrl':
                    this.drawText(item.name, rect.x + 4, rect.y, labelWidth);
                    this.drawText(this._serverUrl, rect.x + labelWidth + 4, rect.y, rect.width - labelWidth - 8);
                    break;
                case 'roomCode':
                    this.drawText('Lobby ID:', rect.x + 4, rect.y, labelWidth);
                    this.drawText(this._roomCode || '(Click to edit)', rect.x + labelWidth + 4, rect.y, rect.width - labelWidth - 8);
                    break;
                case 'followLeader':
                    this.drawText('Follow Leader:', rect.x + 4, rect.y, labelWidth);
                    this.changeTextColor(this._followLeader ? this.systemColor() : ColorManager.normalColor());
                    this.drawText(this._followLeader ? 'ON' : 'OFF', rect.x + labelWidth + 4, rect.y, rect.width - labelWidth - 8);
                    this.resetTextColor();
                    break;
                default:
                    this.changeTextColor(this.systemColor());
                    this.drawText(item.name, rect.x, rect.y, rect.width, 'center');
                    break;
            }
            this.changePaintOpacity(true);
        }

        processOk() {
            const item = this._list[this.index()];
            if (!item || !item.enabled) { SoundManager.playBuzzer(); return; }
            SoundManager.playOk();
            if (item.symbol === 'serverUrl') {
                this.startTextInput('Server URL', this._serverUrl || '', (result) => { if (result !== null) this.setServerUrl(result); });
            } else if (item.symbol === 'roomCode') {
                if (!NetworkManager.instance.isMultiplayer()) this.startTextInput('Steam Lobby ID', this._roomCode || '', (result) => { if (result !== null) this.setRoomCode(result); });
                else SoundManager.playBuzzer();
            } else if (item.symbol === 'followLeader') {
                this.setFollowLeader(!this._followLeader);
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

            if (NetworkMode === 'WebSocket') {
                if (nm.isMultiplayer()) {
                    this.drawText(`Players: ${nm.players.size}/${MaxPlayers}`, 4, y); y += this.lineHeight();
                    this.drawText(`My ID: ${nm.myId}`, 4, y); y += this.lineHeight();
                    if (nm.isInParty()) this.drawText(`Party: ${nm.party.members.length}/4`, 4, y);
                    else this.drawText('No party', 4, y);
                } else if (nm.isConnecting()) this.drawText('Connecting...', 4, y);
                else this.drawText('Not connected', 4, y);
            } else {
                if (nm.isMultiplayer()) {
                    this.drawText(`Lobby ID: ${nm.roomId}`, 4, y, this.contentsWidth()); y += this.lineHeight();
                    this.drawText(`Players: ${nm.players.size}/${MaxPlayers}`, 4, y, this.contentsWidth()); y += this.lineHeight();
                    if (nm.isLeader) {
                        this.changeTextColor(this.systemColor());
                        this.drawText('You are the Host', 4, y, this.contentsWidth());
                        this.resetTextColor();
                    } else {
                        this.drawText(`Host ID: Player ${nm.getCurrentLeaderId()}`, 4, y, this.contentsWidth());
                    }
                } else this.drawText('Not connected to a lobby', 4, y, this.contentsWidth());
            }
        }
    }

    // Party Subset UI (WebSocket Only)
    class Window_MultiplayerPlayerList extends Window_Selectable {
        constructor(rect) { super(rect); this._data = []; this.refresh(); }
        maxItems() { return this._data.length; }
        selectedPlayer() { return this._data[this.index()]; }
        refresh() {
            const nm = NetworkManager.instance;
            if (NetworkMode !== 'WebSocket') return;
            const myId = nm.myId;
            const partyMembers = nm.isInParty() ? nm.party.members : [];
            this._data = Array.from(nm.players.entries()).filter(([id, _]) => id !== myId && !partyMembers.includes(id)).map(([id, info]) => ({ id, info }));
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
        itemHeight() { return 72; }
        processOk() { if (this._data[this.index()]) this.callHandler('invite'); else SoundManager.playBuzzer(); }
    }

    class Window_MultiplayerParty extends Window_Selectable {
        constructor(rect) { super(rect); this.refresh(); }
        refresh() { this.makeCommandList(); this.contents.clear(); super.refresh(); }
        makeCommandList() {
            this._commands = [];
            const nm = NetworkManager.instance;
            if (NetworkMode !== 'WebSocket') return;
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
            const rect = this.itemLineRect(index + 1);
            this.changePaintOpacity(item.enabled);
            if (item.player) {
                this.drawFace(item.player.faceName, item.player.faceIndex, rect.x, rect.y, 64, 64);
                this.drawText(item.name, rect.x + 74, rect.y + 12, rect.width - 74);
            } else if (item.symbol === 'leave') {
                this.changeTextColor(this.systemColor());
                this.drawText(item.name, rect.x, rect.y, rect.width, 'center');
            } else { this.drawText(item.name, rect.x, rect.y, rect.width, 'center'); }
        }
        itemHeight() { return 72; }
        processOk() {
            const item = this._commands[this.index()];
            if (item && item.enabled) { this.callHandler(item.symbol); SoundManager.playOk(); }
            else SoundManager.playBuzzer();
        }
    }

    // Party Invitation Popups
    class PartyUIManager {
        constructor() { this._invitationQueue = []; this._currentWindow = null; }
        static get instance() { if (!this._instance) this._instance = new PartyUIManager(); return this._instance; }
        showInvitation(inviterId, inviterName) { this._invitationQueue.push({ inviterId, inviterName }); }
        update() {
            if (NetworkMode !== 'WebSocket') return;
            if (this._currentWindow && this._currentWindow.isClosed()) {
                const scene = SceneManager._scene;
                if (scene && scene._invitationWindow === this._currentWindow) { scene.removeWindow(this._currentWindow); scene._invitationWindow = null; }
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
        constructor(rect, inviteData) { super(rect); this._invite = inviteData; this.openness = 0; this.open(); this.activate(); }
        makeCommandList() { this.addCommand("Accept", "accept", true); this.addCommand("Decline", "decline", true); }
        windowWidth() { return 400; }
        drawItem(index) {
            if (index === 0) this.drawTextEx(`\\c[1]${this._invite.inviterName}\\c[0] has invited you to a party.`, this.itemPadding(), 0);
            const rect = this.itemLineRect(index + 1);
            const enabled = this.isCommandEnabled(this.commandSymbol(index));
            this.changePaintOpacity(enabled);
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'center');
        }
        itemRect(index) { return super.itemRect(index + 1); }
        processOk() {
            if (this.currentSymbol() === 'accept') NetworkManager.instance.sendPartyAccept(this._invite.inviterId);
            SoundManager.playOk(); this.close();
        }
        processCancel() { this.close(); }
    }


    class Window_PlayerList extends Window_Base {
        constructor(rect) { super(rect); this.opacity = 0; this._bustSprites = []; this.refresh(); }
        refresh() {
            this.contents.clear();
            for (const sprite of this._bustSprites) if (sprite.parent) this.removeChild(sprite);
            this._bustSprites = [];
            const nm = NetworkManager.instance;
            if (!nm.isMultiplayer()) return;

            let playersToDisplay = [];
            if (NetworkMode === 'WebSocket' && nm.isInParty()) {
                for (const memberId of nm.party.members) {
                    const playerInfo = nm.players.get(memberId);
                    if (playerInfo) playersToDisplay.push(playerInfo);
                }
            } else {
                const currentMapId = $gameMap.mapId();
                for (const playerInfo of nm.players.values()) {
                    if (playerInfo.mapId === currentMapId || NetworkMode === 'Steamworks') playersToDisplay.push(playerInfo);
                }
            }

            const bustSize = 64;
            const itemHeight = Math.max(this.lineHeight() * 2, bustSize);
            this.height = this.fittingHeight(playersToDisplay.length);
            this.createContents();

            playersToDisplay.forEach((player, index) => {
                if (!player) return;
                const y = index * (itemHeight + 8);
                this.drawFace(player.faceName, player.faceIndex, 0, y, bustSize, bustSize);
                this.drawText(player.name, bustSize + 10, y, this.contentsWidth() - bustSize - 10);
            });
        }
        fittingHeight(numItems) { return numItems * (Math.max(this.lineHeight() * 2, 64) + 8) + this.padding * 2; }
        update() { super.update(); this.visible = NetworkManager.instance.isMultiplayer(); }
    }


    // ============================================================================
    // GAME HOOKS & INTEGRATIONS
    // ============================================================================
    PluginManager.registerCommand(PLUGIN_NAME, 'openConnectionsMenu', () => SceneManager.push(Scene_Multiplayer));

    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function () {
        _SceneManager_updateMain.apply(this, arguments);
        if (NetworkManager.instance.isMultiplayer()) PartyUIManager.instance.update();
    };

    const _Scene_Map_isMapScene = Scene_Map.prototype.isMapScene;
    Scene_Map.prototype.isMapScene = function () { return _Scene_Map_isMapScene.call(this) && !this._invitationWindow; };

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function (switchId, value, fromNetwork = false) {
        if (this.value(switchId) === value) return;
        _Game_Switches_setValue.call(this, switchId, value);
        if (!fromNetwork) NetworkManager.instance.onSwitchChange(switchId, value);
    };

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value, fromNetwork = false) {
        if (this.value(variableId) === value) return;
        _Game_Variables_setValue.call(this, variableId, value);
        if (!fromNetwork) NetworkManager.instance.onVariableChange(variableId, value);
    };

    const _Game_SelfSwitches_setValue = Game_SelfSwitches.prototype.setValue;
    Game_SelfSwitches.prototype.setValue = function (key, value, fromNetwork = false) {
        const oldValue = this.value(key);
        _Game_SelfSwitches_setValue.call(this, key, value);
        if (!fromNetwork && oldValue !== value && NetworkMode === 'Steamworks') {
            const [mapId, eventId, switchType] = key;
            NetworkManager.instance.onSelfSwitchChange(mapId, eventId, switchType, value);
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        MultiplayerManager.instance.update();
    };

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_onMapLoaded.call(this);
        MultiplayerManager.instance.onMapLoaded();
    };

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _Scene_Map_createAllWindows.call(this);
        this.createPlayerListWindow();
    };

    Scene_Map.prototype.createPlayerListWindow = function () {
        this._playerListWindow = new Window_PlayerList(new Rectangle(10, 100, 280, 100));
        this.addWindow(this._playerListWindow);
    };

    const _Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
        if (!$gameMap.isEventRunning()) {
            for (const event of $gameMap.eventsXy(x, y)) {
                if (event.event().name.match(/^Player\d+$/)) continue;
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) { event.start(); return; }
            }
        }
    };

    const _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement = function () {
        if (NetworkManager.instance.isMultiplayer()) {
            if (NetworkMode === 'WebSocket') return;
            if (NetworkMode === 'Steamworks' && !NetworkManager.instance.isLeader && this.event().name !== 'Enemy') return;
        }
        _Game_Event_updateSelfMovement.call(this);
    };

    const _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function () {
        _Game_Player_refresh.call(this);
        if (NetworkManager.instance.isMultiplayer()) {
            const networkManager = NetworkManager.instance;
            const myId = networkManager.myId;
            const myInfo = networkManager.players.get(myId);
            if (myId) {
                const newInfo = networkManager.createPlayerInfo();
                if (NetworkMode === 'WebSocket' || (myInfo && JSON.stringify(myInfo) !== JSON.stringify(newInfo))) {
                    networkManager.players.set(myId, newInfo);
                    if (NetworkMode === 'WebSocket') networkManager.send({ type: 'player-meta', info: newInfo });
                    else networkManager.broadcast({ type: 'player-meta', info: newInfo });
                }
            }
        }
    };

    const _Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
    Game_Interpreter.prototype.command301 = function (params) {
        if (NetworkManager.instance.isMultiplayer() && !BattleManager.isBattleTest()) {
            const packet = { type: 'player-state-change', state: 'battling', from: NetworkManager.instance.myId };
            if (NetworkMode === 'WebSocket') NetworkManager.instance.send(packet);
            else NetworkManager.instance.broadcast(packet);

            const originalCallback = this._branch[this._indent];
            this._branch[this._indent] = (result) => {
                const clearPacket = { type: 'player-state-change', state: 'idle', from: NetworkManager.instance.myId };
                if (NetworkMode === 'WebSocket') NetworkManager.instance.send(clearPacket);
                else NetworkManager.instance.broadcast(clearPacket);
                if (originalCallback) originalCallback(result);
            };
        }
        return _Game_Interpreter_command301.call(this, params);
    };

    // Main Menu Append
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand("Multiplayer", "multiplayer", true, 44);
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("multiplayer", () => SceneManager.push(Scene_MultiplayerTypeSelection));
    };

    if (ShowPlayerNames) {
        const _Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
        Sprite_Character.prototype.initMembers = function () {
            _Sprite_Character_initMembers.call(this);
            this._nameplateSprite = null;
        };

        const _Sprite_Character_update = Sprite_Character.prototype.update;
        Sprite_Character.prototype.update = function () {
            _Sprite_Character_update.call(this);
            if (!this._character || !NetworkManager.instance.isMultiplayer()) {
                if (this._nameplateSprite) { this.removeChild(this._nameplateSprite); this._nameplateSprite = null; }
                return;
            }
            const eventId = this._character.eventId && this._character.eventId();
            const playerId = eventId ? MultiplayerManager.instance.eventPlayerMap.get(eventId) : null;
            if (playerId) {
                const playerInfo = NetworkManager.instance.players.get(playerId);
                if (playerInfo && !this._nameplateSprite) this.createNameplate(playerInfo.name || `Player ${playerId}`);
            } else if (this._nameplateSprite) {
                this.removeChild(this._nameplateSprite); this._nameplateSprite = null;
            }
        };

        Sprite_Character.prototype.createNameplate = function (name) {
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
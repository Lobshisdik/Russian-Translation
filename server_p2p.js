// GMN LAN Multiplayer Signaling Server
// Author: OmniLex (Updated)
// Version: 1.2.0
//
// This is a lightweight WebSocket server for establishing WebRTC connections
// between RPG Maker MZ clients on a local network.
//
// CHANGES v1.2.0:
// - Increased maximum players per room from 3 to 8
// - Improved player ID assignment logic for larger rooms
// - Enhanced room management for more players
//
// CHANGES v1.1.0:
// - Added room listing functionality
// - Players can now browse and join existing rooms
//
// HOW TO RUN:
// 1. Make sure you have Node.js installed (https://nodejs.org/).
// 2. Open a terminal or command prompt.
// 3. Navigate to the directory where this file is saved.
// 4. Run the command: node signaling_server.js
//
// The server will then be running and listening for connections.

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// In-memory store for rooms and players
// For a real-world application, you might use a more robust store like Redis.
const rooms = new Map(); // key: roomId, value: Map(playerId, ws)

const MAX_PLAYERS_PER_ROOM = 8;

console.log('Signaling server started on port 8080...');
console.log(`Maximum players per room: ${MAX_PLAYERS_PER_ROOM}`);
console.log('Waiting for players to connect...');

wss.on('connection', (ws) => {
    console.log('Client connected.');

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error('Invalid JSON received:', message);
            return;
        }

        switch (data.type) {
            case 'create':
                handleCreateRoom(ws, data.roomId);
                break;
            case 'join':
                handleJoinRoom(ws, data.roomId, data.playerInfo);
                break;
            case 'list-rooms':
                handleListRooms(ws);
                break;
            // The following messages are for WebRTC signaling and are just forwarded
            case 'webrtc-offer':
            case 'webrtc-answer':
            case 'webrtc-candidate':
                forwardMessage(ws, data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
        handleDisconnect(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function handleCreateRoom(ws, roomId) {
    if (rooms.has(roomId)) {
        sendMessage(ws, { type: 'error', message: 'Room already exists.' });
        return;
    }

    const players = new Map();
    const playerId = 1; // The creator is always Player 1
    players.set(playerId, ws);

    ws.meta = { roomId, playerId };
    rooms.set(roomId, players);

    console.log(`Room "${roomId}" created by Player ${playerId}.`);
    sendMessage(ws, { type: 'room-created', roomId });
}

function handleJoinRoom(ws, roomId, playerInfo) {
    const room = rooms.get(roomId);
    if (!room) {
        sendMessage(ws, { type: 'error', message: 'Room not found.' });
        return;
    }

    if (room.size >= MAX_PLAYERS_PER_ROOM) {
        sendMessage(ws, { type: 'error', message: 'Room is full.' });
        return;
    }

    // Find the next available player ID (2-8)
    const newPlayerId = findNextAvailablePlayerId(room);
    if (!newPlayerId) {
        sendMessage(ws, { type: 'error', message: 'No available player slots.' });
        return;
    }

    ws.meta = { roomId, playerId: newPlayerId };

    // Notify existing players about the new player
    const otherPlayers = [];
    for (const [id, client] of room.entries()) {
        otherPlayers.push({ id, info: client.meta.playerInfo }); // Send existing players' info to new player
        sendMessage(client, { type: 'player-joined', playerId: newPlayerId, playerInfo });
    }
    
    ws.meta.playerInfo = playerInfo; // Store info for future joiners
    room.set(newPlayerId, ws);

    console.log(`Player ${newPlayerId} joined room "${roomId}" (${room.size}/${MAX_PLAYERS_PER_ROOM} players).`);
    sendMessage(ws, { type: 'room-joined', roomId, yourId: newPlayerId, otherPlayers });
}

function findNextAvailablePlayerId(room) {
    // Find the lowest available player ID from 2 to MAX_PLAYERS_PER_ROOM
    for (let id = 2; id <= MAX_PLAYERS_PER_ROOM; id++) {
        if (!room.has(id)) {
            return id;
        }
    }
    return null; // No available slots
}

function handleListRooms(ws) {
    const roomList = Array.from(rooms.entries()).map(([roomId, players]) => ({
        id: roomId,
        players: players.size,
        maxPlayers: MAX_PLAYERS_PER_ROOM,
        isFull: players.size >= MAX_PLAYERS_PER_ROOM
    }));
    
    console.log(`Sending room list to client: ${roomList.length} rooms available`);
    sendMessage(ws, {
        type: 'room-list',
        rooms: roomList
    });
}

function handleDisconnect(ws) {
    if (!ws.meta) return; // Client disconnected before joining a room

    const { roomId, playerId } = ws.meta;
    const room = rooms.get(roomId);

    if (room) {
        room.delete(playerId);
        console.log(`Player ${playerId} left room "${roomId}" (${room.size}/${MAX_PLAYERS_PER_ROOM} players remaining).`);

        // If the leader (Player 1) disconnects, or room is empty, close the room
        if (playerId === 1 || room.size === 0) {
            console.log(`Closing room "${roomId}".`);
            for (const client of room.values()) {
                sendMessage(client, {type: 'error', message: 'The room has been closed by the leader.'});
                client.close();
            }
            rooms.delete(roomId);
        } else {
            // Notify remaining players that this player has left
            for (const client of room.values()) {
                sendMessage(client, { type: 'player-left', playerId });
            }
        }
    }
}

function forwardMessage(ws, data) {
    if (!ws.meta) return;
    const { roomId, playerId } = ws.meta;
    const room = rooms.get(roomId);

    if (room && data.to) {
        const recipient = room.get(data.to);
        if (recipient) {
            // Forward the message but ensure the 'from' field is correct
            data.from = playerId;
            sendMessage(recipient, data);
        } else {
            console.log(`Could not find recipient ${data.to} in room ${roomId}`);
        }
    }
}

function sendMessage(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}
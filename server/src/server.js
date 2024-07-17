const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const GameRoomsManager = require('./gameRoomsManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    pingInterval: 60000, // Intervalo entre pings do servidor para o cliente
    pingTimeout: 5000, // Tempo que o servidor espera por uma resposta do ping
});

const PORT = 8080;
const roomsManager = new GameRoomsManager();

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('createRoom', () => {
        try {
            const room = roomsManager.createRoom(socket);
            socket.emit('createdRoom', room.id);
            console.log(`Room created:`, room.id);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('closeRoom', (code) => {
        try {
            if (roomsManager.getRoom(code).getPlayers().player2) {
                roomsManager
                    .getRoom(code)
                    .getPlayers()
                    .player2.emit('exitRoom');
            }
            roomsManager.getRoom(code).getPlayers().player1.emit('closedRoom');
            roomsManager.deleteRoom(code);
            console.log(
                `Room closed:`,
                roomsManager.listRooms().map((x) => x.id)
            );
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('enterRoom', (code) => {
        try {
            if (roomsManager.getRoom(code).isFull()) {
                socket.emit('enterRoom', false, code);
                return;
            }
            let error = roomsManager.getRoom(code).toString();
            if (error === 'Room not found or invalid type') {
            }

            error = roomsManager.getRoom(code).addPlayer2(socket);
            roomsManager.getRoom(code).getPlayers().player1.emit('playerEnter');
            roomsManager
                .getRoom(code)
                .getPlayers()
                .player2.emit('enterRoom', true, code);
            console.log('A player joined the room');
        } catch (error) {
            socket.emit('error', error.message);
        }
    });
    socket.on('exitRoom', (code) => {
        try {
            roomsManager.getRoom(code).getPlayers().player2.emit('exitRoom');
            roomsManager.getRoom(code).removePlayer2();
            roomsManager.getRoom(code).getPlayers().player1.emit('playerExit');
            console.log('Player 2 left the room');
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('startGame', (code, mark) => {
        try {
            const players = roomsManager.getRoom(code).getPlayers();
            if (roomsManager.getRoom(code).isFull()) {
                players.player1.emit('startGame', true, mark);
                players.player2.emit('startGame', true, mark);
            } else {
                players.player1.emit('startGame', false, mark);
            }
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('move', (code, move, isPlayer1) => {
        try {
            if (isPlayer1) {
                roomsManager
                    .getRoom(code)
                    .getPlayers()
                    .player2.emit('move', move);
            } else {
                roomsManager
                    .getRoom(code)
                    .getPlayers()
                    .player1.emit('move', move);
            }
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('nextGame', (code, navigate) => {
        try {
            const players = roomsManager.getRoom(code).getPlayers();
            players.player2.emit('nextGame', navigate);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('quitGame', (code, navigate) => {
        try {
            const players = roomsManager.getRoom(code).getPlayers();
            players.player2.emit('quitGame', navigate);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('reconnect', (code, isHost) => {
        try {
            const room = roomsManager.getRoom(code);
            if (isHost) {
                room.player1 = socket;
            } else {
                room.player2 = socket;
            }
            console.log('Reconnected to the room');
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('disconnect', () => {
        const room = roomsManager
            .listRooms()
            .find((room) => room.player1 === socket || room.player2 === socket);
        if (room) {
            const code = room.id;

            if (room.player1 === socket) {
                room.player1 = null;
            } else if (room.player2 === socket) {
                room.player2 = null;
            }
        }

        console.log('A client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});

const CLEANUP_INTERVAL = 10000; // 1 minuto

setInterval(() => {
    roomsManager.listRooms().forEach((room) => {
        // Se a sala está vazia, exclua
        if (room.player1 === null) {
            if (room.player2) {
                room.player2.emit('exitRoom');
            }
            roomsManager.deleteRoom(room.id);
            console.log(`Room closed due to inactivity: ${room.id}`);
        } else if (room.player2 === null) {
            room.player1.emit('playerExit');
        } else {
            console.log(`Room : ${room.id}`);
        }
    });
}, CLEANUP_INTERVAL);

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const GameRoomsManager = require('./gameRoomsManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Permitir qualquer origem
        methods: ['GET', 'POST'], // Permitir apenas os métodos GET e POST
    },
});

const PORT = 8080;
const roomsManager = new GameRoomsManager();

io.on('connection', (socket) => {
    console.log('Um cliente se conectou');

    socket.on('createRoom', () => {
        try {
            const room = roomsManager.createRoom(socket);
            socket.emit('createdRoom', room.id);
            console.log(`Sala criada:`, room.id);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('closeRoom', (code) => {
        try {
            console.log(code);
            if (roomsManager.getRoom(code).getPlayers().player2) {
                roomsManager
                    .getRoom(code)
                    .getPlayers()
                    .player2.emit('exitRoom');
            }
            console.log('estou aqui');
            roomsManager.getRoom(code).getPlayers().player1.emit('closedRoom');
            console.log('estou aq');
            roomsManager.deleteRoom(code);
            console.log('estou');
            console.log(
                `Sala fechada:`,
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
            console.log('Um jogador entrou na sala');
        } catch (error) {
            socket.emit('error', error.message);
        }
    });
    socket.on('exitRoom', (code) => {
        try {
            roomsManager.getRoom(code).getPlayers().player2.emit('exitRoom');
            roomsManager.getRoom(code).removePlayer2();
            roomsManager.getRoom(code).getPlayers().player1.emit('playerExit');
            console.log('O jogador 2 saiu da sala.');
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
            console.log(
                `Sala fechada:`,
                roomsManager.listRooms().map((x) => x.id)
            );
            console.log('reconectado a sala.');
        } catch (error) {
            console.log(
                `Sala fechada:`,
                roomsManager.listRooms().map((x) => x.id)
            );
            socket.emit('error', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Um cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor Socket.IO está rodando na porta ${PORT}`);
});

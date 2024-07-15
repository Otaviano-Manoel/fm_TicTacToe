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
        const room = roomsManager.createRoom(socket);
        socket.emit('createdRoom', room.id);
        console.log(`Sala criada:`, room.id);
    });

    socket.on('closeRoom', (code) => {
        if (roomsManager.getRoom(code).getPlayers().player2) {
            roomsManager.getRoom(code).getPlayers().player2.emit('exitRoom');
        }
        roomsManager.getRoom(code).getPlayers().player1.emit('closedRoom');
        roomsManager.deleteRoom(code);
        console.log(
            `Sala fechada:`,
            roomsManager.listRooms().map((x) => x.id)
        );
    });

    socket.on('enterRoom', (code) => {
        if (roomsManager.getRoom(code).isFull()) {
            socket.emit('enterRoom', false, code);
            return;
        }
        roomsManager.getRoom(code).addPlayer2(socket);
        roomsManager.getRoom(code).getPlayers().player1.emit('playerEnter');
        roomsManager
            .getRoom(code)
            .getPlayers()
            .player2.emit('enterRoom', true, code);
        console.log('Um jogador entrou na sala');
    });
    socket.on('exitRoom', (code) => {
        roomsManager.getRoom(code).getPlayers().player2.emit('exitRoom');
        roomsManager.getRoom(code).removePlayer2();
        roomsManager.getRoom(code).getPlayers().player1.emit('playerExit');
        console.log('O jogador 2 saiu da sala.');
    });

    socket.on('startGame', (code, mark) => {
        const players = roomsManager.getRoom(code).getPlayers();
        if (roomsManager.getRoom(code).isFull()) {
            players.player1.emit('startGame', true, mark);
            players.player2.emit('startGame', true, mark);
        } else {
            players.player1.emit('startGame', false, mark);
        }
    });

    socket.on('move', (code, move, isPlayer1) => {
        if (isPlayer1) {
            roomsManager.getRoom(code).getPlayers().player2.emit('move', move);
        } else {
            roomsManager.getRoom(code).getPlayers().player1.emit('move', move);
        }
    });

    socket.on('disconnect', () => {
        console.log('Um cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor Socket.IO está rodando na porta ${PORT}`);
});

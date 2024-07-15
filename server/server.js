require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Permitir qualquer origem
        methods: ['GET', 'POST'], // Permitir apenas os métodos GET e POST
    },
});

const PORT = process.env.PORT || 8080;

io.on('connection', (socket) => {
    console.log('Um cliente se conectou');

    socket.on('disconnect', () => {
        console.log('desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor Socket.IO está rodando na porta ${PORT}`);
});

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

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('Um cliente se conectou');

    socket.on('host', (cod) => {
        console.log(
            '-------------------------------------------------------------'
        );
        if (cod === -1) {
            let code = generateUniqueCode();
            rooms.set('h' + code, socket);
            console.log('Criada a sala de codigo:', code);
            socket.emit('code', code);
        } else {
            socket.emit('code', -2);
        }
    });

    socket.on('client', (cod) => {
        console.log(
            '-------------------------------------------------------------'
        );
        const codeHost = 'h' + cod;
        const codeClient = 'c' + cod;
        if (rooms.has(codeHost)) {
            if (!rooms.has(codeClient)) {
                rooms.set(codeClient, socket);
                socket.emit('code', cod);
                console.log('cliente adicionado:', codeClient);
            } else {
                console.log('Esta sala ja esta cheia.');
            }
        } else {
            console.log('A sala não existe.');
        }
    });

    socket.on('closed', (code, isClient) => {
        console.log(
            '-------------------------------------------------------------'
        );
        const codeHost = 'h' + code;
        const codeClient = 'c' + code;
        console.log(codeHost, codeClient);
        if (!isClient) {
            console.log('sou um host');
            console.log('estou deletando o host');
            rooms.delete(codeHost);
            if (rooms.has(codeClient)) {
                console.log('estou avisando ao client');
                rooms.get(codeClient).emit('closed', false);
            }
        } else {
            console.log('sou um client');
            if (rooms.has(codeHost)) {
                console.log('estou avisando ao host');
                rooms.get(codeHost).emit('closed', true);
            }
        }

        if (rooms.has(codeClient)) {
            console.log('estou deletando o client');
            rooms.delete(codeClient);
        }
    });

    socket.on('start', (code, mark) => {
        const codeHost = 'h' + code;
        const codeClient = 'c' + code;

        if (rooms.has(codeHost) && rooms.has(codeClient)) {
            socket.emit('start', true);
            rooms.get(codeClient).emit('start', true, mark);
        } else {
            console.log(mark);
            socket.emit('start', false);
        }
    });

    socket.on('disconnect', () => {
        console.log('desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor Socket.IO está rodando na porta ${PORT}`);
});

const generateUniqueCode = () => {
    const MAX_CODE = 1000;
    for (let i = 0; i < MAX_CODE; i++) {
        if (!rooms.has('h' + i)) {
            return i;
        }
    }
    return -1;
};

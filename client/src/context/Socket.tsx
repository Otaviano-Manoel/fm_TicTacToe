import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameManager } from './GameManager';
import ControllerGameManager from '../utils/GameMangerUtils';
import { useNavigate } from 'react-router-dom';

const socketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    const context = useContext(socketContext);
    if (context === null) {
        throw new Error("useSocket deve ser usado dentro de um SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const { gameManager, setGameManager } = useGameManager();

    if (!socketRef.current) {
        socketRef.current = io('http://localhost:8080', {
            reconnection: true,
            reconnectionAttempts: Infinity, // Tentativas de reconexão infinitas
            reconnectionDelay: 1000, // Tempo entre as tentativas de reconexão (em ms)
            reconnectionDelayMax: 5000, // Tempo máximo entre as tentativas de reconexão (em ms)
            timeout: 20000 // Tempo de timeout para conexão inicial (em ms)
        });
    }
    const navigate = useNavigate();

    useEffect(() => {
        const socket = socketRef.current;

        socket!.on('connect', () => {
            console.log('Conectado ao servidor Socket.IO');
        });

        socket!.on('disconnect', () => {
            console.log('Desconectado do servidor Socket.IO');
        });

        // Adicione outros eventos de socket aqui
        socket!.on('createdRoom', (roomId: string) => {
            console.log(`Sala criada com ID: ${roomId}`);
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['server.code', 'server.host'], [roomId, true], gameManager));
        });
        socket?.on('closedRoom', () => {
            console.log('A sala fechou');
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['server.host', 'server.code'], [false, null], gameManager));
        });

        socket?.on('enterRoom', (isEnter, id) => {
            if (!isEnter) {
                console.log('Sala cheia:', id);
                return;
            };
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['server.code'], [id], gameManager));
        });

        socket?.on('exitRoom', () => {
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['server.code'], [null], gameManager));
        });
        socket?.on('playerExit', () => {
            console.log('o jogador saiu,');
        });

        socket?.on('startGame', (isStartGame, mark) => {
            if (isStartGame) {
                setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['game.player2.mark'], [mark], gameManager));
                navigate('/game');
                console.log(gameManager)
            }
            else {
                console.log('falta um jogador');
            }
        });

        socket?.on('move', (move) => {
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['server.move'], [move], gameManager));
        });

        // Limpeza quando o componente é desmontado
        return () => {
            socket!.off('connect');
            socket!.off('disconnect');
            socket!.off('roomCreated');
            socket!.off('enterRoom');
            socket!.off('exitRoom');
            socket!.off('playerExit');
            socket!.off('startGame');
            socket!.off('move');
        };
    }, [gameManager, navigate, setGameManager]);

    return (
        <socketContext.Provider value={socketRef.current}>
            {children}
        </socketContext.Provider>
    );
};
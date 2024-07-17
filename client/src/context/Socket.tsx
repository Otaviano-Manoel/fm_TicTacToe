import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameManager } from './GameManager';
import ControllerGameManager from '../utils/GameMangerUtils';
import { useNavigate } from 'react-router-dom';
import { useGameBoard } from './GameBoardContext';
import { getDefaultIGameBoard } from '../interface/IGameBoard';

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
    const { gameBoard, setGameBoard } = useGameBoard();

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
            console.log('Connected to Socket.IO server');
            if (gameManager.server.code !== null) {
                socket?.emit('reconnect', gameManager.server.code, gameManager.server.host)
            }
        });

        socket!.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        socket!.on('createdRoom', (roomId: string) => {
            console.log(`Room created with ID: ${roomId}`);
            setGameManager(ControllerGameManager.updateValues(['server.code', 'server.host'], [roomId, true], gameManager));
        });
        socket?.on('closedRoom', () => {
            console.log('The room closed');
            setGameManager(ControllerGameManager.updateValues(['server.host', 'server.code'], [false, null], gameManager));
        });

        socket?.on('enterRoom', (isEnter, id) => {
            if (!isEnter) {
                console.log('Room full:', id);
                return;
            };
            setGameManager(ControllerGameManager.updateValues(['server.code'], [id], gameManager));
        });

        socket?.on('exitRoom', () => {
            setGameManager(ControllerGameManager.updateValues(['server.code'], [null], gameManager));
            if (window.location.pathname === '/game' || window.location.pathname === '/game/panels') {
                navigate('/connect');
                ControllerGameManager.updateValues(['server.client'], [false], gameManager)
            }
        });
        socket?.on('playerExit', () => {
            console.log('The player left');
            if (window.location.pathname === '/game' || window.location.pathname === '/game/panels') {
                navigate('/connect');
            }
        });

        socket?.on('startGame', (isStartGame, mark) => {
            if (isStartGame) {
                if (window.location.pathname === '/') {
                    navigate('/connect');
                }
                setGameManager(ControllerGameManager.updateValues(['game.player2.mark', 'game.type'], [mark, 'multiplayer'], gameManager));
                navigate('/game');
            }
            else {
                console.log('One player missing');
            }
        });

        socket?.on('move', (move) => {
            setGameManager(ControllerGameManager.updateValues(['server.move'], [move], gameManager));
        });

        socket?.on('nextGame', (url) => {
            if (url !== '') {
                navigate(url);
            }
            const newGame = getDefaultIGameBoard();
            newGame.numberWins.o = gameBoard.numberWins.o;
            newGame.numberWins.ties = gameBoard.numberWins.ties;
            newGame.numberWins.x = gameBoard.numberWins.x;
            setGameBoard(newGame);
        });

        socket?.on('quitGame', (url) => {
            navigate(url);
            setGameBoard(getDefaultIGameBoard());
        });

        socket?.on('error', (message) => {
            window.alert(message);
            if (gameManager.server.code !== null) {
                ControllerGameManager.updateValues(['server.code'], [null], gameManager)
                if (gameManager.server.host) {
                    ControllerGameManager.updateValues(['server.host'], [false], gameManager)
                }
                else if (gameManager.server.client) {
                    ControllerGameManager.updateValues(['server.client'], [false], gameManager)
                }
            }
            if (window.location.pathname === '/game' || window.location.pathname === '/game/panels') {
                navigate('/');
            }
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
            socket!.off('nextGame');
            socket!.off('quitGame');
            socket!.off('error');
        };
        // eslint-disable-next-line
    }, [gameManager, navigate, setGameManager]);

    return (
        <socketContext.Provider value={socketRef.current}>
            {children}
        </socketContext.Provider>
    );
};
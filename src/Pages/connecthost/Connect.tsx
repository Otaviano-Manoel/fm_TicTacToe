import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from './connect.module.scss';
import { useSocket } from '../../Context/server/Socket';
import { useGameManager } from '../../Context/GameManager/GameManager';
import ControllerGameManager from '../../Context/GameManager/GameMangerUtils';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useGameBoard } from '../../Context/GameBoard/GameBoard';
import { getDefaultIGameBoard } from '../../Context/GameBoard/IGameBoard';

function Connect() {

    const socket = useSocket();
    const { gameManager, setGameManager } = useGameManager();
    const { setGameBoard } = useGameBoard();
    const controller = new ControllerGameManager(gameManager);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setInputValue(gameManager.server.code !== null ? gameManager.server.code.toString() : '');

        const handlerCode = (code: number) => {
            if (code === -1) {
                console.error('Todas as salas estão ocupadas.')
                return;
            }
            else if (code === -2) {
                console.error('Você ja esta conectado.');
                return;
            }
            setInputValue(code.toString());
            setGameManager(controller.updateValues('server.code', code));
        }

        const handlerClosed = (isClient: boolean) => {
            if (isClient) {
                console.log('o client saiu')
            }
            else {
                console.log('o host foi desligado')
                setGameManager(controller.updateValues('server.code', null));
                setGameManager(controller.updateValues('server.client', false));
                setInputValue('');
            }
        }

        const handlerStart = (start: boolean, mark: boolean) => {
            if (start) {
                setGameBoard(getDefaultIGameBoard());
                if (gameManager.server.client) {
                    const manager = { ...gameManager };
                    manager.game.player1.playerType = 'user';
                    manager.game.player1.mark = mark;
                    setGameManager(manager);
                }
                navigate('/game');
            }
            else {
                console.log('falta um jogador');
            }
        }

        socket.off('code').on('code', handlerCode);
        socket.off('closed').on('closed', handlerClosed);
        socket.off('start').on('start', handlerStart);

        return () => {
            socket.off('code', handlerCode);
            socket.off('closed', handlerClosed);
            socket.off('start', handlerStart);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getFunctionsAndStyled = useCallback(() => {
        const selectTypeRoom = !gameManager.server.host && !gameManager.server.client;
        return {
            inputDisable: gameManager.server.host || selectTypeRoom,
            host: classNames(styled.opt1, gameManager.server.host ? styled.active : ''),
            client: classNames(styled.opt2, gameManager.server.client ? styled.active : ''),
            connect: classNames(styled.connect, selectTypeRoom ? styled.desactive : ''),
            start: classNames(styled.start, !gameManager.server.host ? styled.hidden : ''),
        };
    }, [gameManager])

    const getTextFields = useCallback(() => {
        if (!gameManager.server.host && !gameManager.server.client) {
            return {
                inputValue: ' ',
                paragraphy: 'Select Host or Client',
                connect: '',
            };
        }

        if (gameManager.server.host) {
            return {
                inputValue: gameManager.server.code !== null ? gameManager.server.code.toString() : ' ',
                paragraphy: 'This is your room {Send code to friend}',
                connect: 'Disconnect',
            };
        }

        if (gameManager.server.client) {
            return {
                inputValue: 'Enter the code here',
                paragraphy: 'Enter the room code',
                connect: gameManager.server.code !== null ? 'Disconnect' : 'Connect',
            };
        }

        return {};
    }, [gameManager])

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.currentTarget.value);
    }

    const handlerHost = () => {
        const CreateRoom = () => {
            if (!socket.active) {
                socket.connect();
            }
            socket.emit('host', gameManager.server.code === null ? -1 : gameManager.server.code);
        }

        setGameManager(controller.updateValues('server.host', true));
        CreateRoom();
    }

    const handlerClient = () => {
        if (gameManager.server.host) {
            handlerConnectorDisconnect('disconnect');
        }
        setGameManager(controller.updateValues('server.client', true));
    }

    const handlerConnectorDisconnect = (opt: 'disconnect' | 'connect') => {
        if (gameManager.server.code !== null && opt === 'disconnect') {
            socket.emit('closed', gameManager.server.code, gameManager.server.client);
            setGameManager(controller.updateValues('server.code', null));
            if (gameManager.server.host) {
                setGameManager(controller.updateValues('server.host', false));
            } else if (gameManager.server.client) {
                setGameManager(controller.updateValues('server.client', false));
            }
            setInputValue('');
            socket.disconnect();
        }

        if (gameManager.server.client && opt === 'connect') {
            if (!socket.active) {
                socket.connect();
            }
            socket.emit('client', inputValue);
        }
    }

    const handlerStartGame = () => {
        socket.emit('start', gameManager.server.code, gameManager.game.player2.mark);
    }

    return (
        <section className={styled.server}>
            <div className={styled['port-container']}>
                <label className={styled.title} htmlFor="server">{getTextFields().paragraphy}</label>
                <input
                    onChange={onChangeValue}
                    disabled={getFunctionsAndStyled().inputDisable}
                    className={styled.port}
                    type="number"
                    id="server"
                    placeholder={getTextFields().inputValue}
                    value={inputValue}
                />
            </div>
            <div className={styled.options}>
                <button onClick={handlerHost} className={getFunctionsAndStyled().host} type="button">HOST</button>
                <button onClick={handlerClient} className={getFunctionsAndStyled().client} type="button">CLIENT</button>
            </div>
            <button
                onClick={() => handlerConnectorDisconnect(gameManager.server.code === null && gameManager.server.client ? 'connect' : 'disconnect')}
                className={getFunctionsAndStyled().connect}
                type="button"
            >
                {getTextFields().connect}
            </button>

            <button
                onClick={handlerStartGame}
                className={getFunctionsAndStyled().start}
                type="button"
            >
                StartGame
            </button>
        </section>
    );
}

export default Connect;
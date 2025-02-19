import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from './connect.module.scss';
import { useGameManager } from '../../context/GameManager';
import ControllerGameManager from '../../utils/GameMangerUtils';
import classNames from 'classnames';
import { useSocket } from '../../context/Socket';

function ServerConfiguration() {
    const { gameManager, setGameManager } = useGameManager();
    const controller = ControllerGameManager;
    const socket = useSocket();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Initialize the input value with the server code if available
        setInputValue(gameManager.server.code !== null ? gameManager.server.code.toString() : '');
    }, [gameManager.server.code]);

    // Function to get dynamic class names and button states
    const getFunctionsAndStyled = useCallback(() => {
        const selectTypeRoom = !gameManager.server.host && !gameManager.server.client;
        return {
            inputDisable: gameManager.server.host || selectTypeRoom,
            host: classNames(styled.opt1, gameManager.server.host ? styled.active : ''),
            client: classNames(styled.opt2, gameManager.server.client ? styled.active : ''),
            stateConnecting: classNames(styled.connect, selectTypeRoom ? styled.desactive : ''),
            start: classNames(styled.start, !gameManager.server.host ? styled.hidden : ''),
        };
    }, [gameManager]);

    // Function to get dynamic texts based on game state
    const getTextFields = useCallback(() => {
        let inputValue = '';
        let paragraphy = '';
        let stateConnecting = '';

        if (!gameManager.server.host && !gameManager.server.client) {
            paragraphy = 'Select Host or Client';
        } else if (gameManager.server.host) {
            paragraphy = 'This is your room {Send code to friend}';
            stateConnecting = 'Disconnect';
        } else if (gameManager.server.client) {
            inputValue = 'Enter the code here';
            paragraphy = 'Enter the room code';
            stateConnecting = gameManager.server.code !== null ? 'Disconnect' : 'Connect';
        }

        return {
            inputValue,
            paragraphy,
            stateConnecting
        };
    }, [gameManager]);

    // Handler for input value change
    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.currentTarget.value.toUpperCase());
    };

    // Handler to set the server as host
    const handlerHost = () => {
        if (gameManager.server.code !== null) return;
        socket.emit('createRoom');
    };

    // Handler to set the server as client and manage disconnection
    const handlerClient = () => {
        if (gameManager.server.code !== null) return;
        setGameManager(controller.updateValues(['server.client'], [true], gameManager));
    };

    // Handler to connect or disconnect based on the option
    const handlerConnectorDisconnect = (opt: 'disconnect' | 'connect') => {
        if (gameManager.server.code !== null && opt === 'disconnect') {
            if (gameManager.server.host) {
                socket.emit('closeRoom', gameManager.server.code);
            }
            else if (gameManager.server.client) {
                socket.emit('exitRoom', gameManager.server.code);
            }
        }

        if (gameManager.server.client && opt === 'connect') {
            socket.emit('enterRoom', inputValue);
        }
    };

    // Handler to start the game
    const handlerStartGame = () => {
        socket.emit('startGame', gameManager.server.code, gameManager.game.player2.mark);
    };

    return (
        <section className={styled.server}>
            <div className={styled['port-container']}>
                <label className={styled.title} htmlFor="server">{getTextFields().paragraphy}</label>
                <input
                    onChange={onChangeValue}
                    disabled={getFunctionsAndStyled().inputDisable}
                    className={styled.port}
                    type="text"
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
                className={getFunctionsAndStyled().stateConnecting}
                type="button"
            >
                {getTextFields().stateConnecting}
            </button>
            <button
                onClick={handlerStartGame}
                className={getFunctionsAndStyled().start}
                type="button"
            >
                Start Game
            </button>
        </section>
    );
}

export default ServerConfiguration;

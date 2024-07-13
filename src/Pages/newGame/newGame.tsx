import React, { useCallback, useEffect } from 'react';
import styled from './newgame.module.scss';
import logo from '../../assets/images/logo.svg';
import classNames from 'classnames';
import { useGameManager } from '../../Context/GameManager/GameManager';
import ControllerGameManager from '../../Context/GameManager/GameMangerUtils';
import { Link } from 'react-router-dom';
import { getDefaultGameManager, IGameManager } from '../../Context/GameManager/IGameManager';
import { useSocket } from '../../Context/server/Socket';

function NewGame() {

    const socket = useSocket();
    const { gameManager, setGameManager } = useGameManager();
    const controller = new ControllerGameManager(gameManager);

    useEffect(() => {
        const resetGame: IGameManager = getDefaultGameManager();
        resetGame.game.player1.mark = gameManager.game.player1.mark;
        resetGame.game.player2.mark = gameManager.game.player2.mark;
        resetGame.server = { ...gameManager.server };

        setGameManager(resetGame);
    }, [])

    const getClassMarkSelect = useCallback(() => {
        return {
            x: {
                container: classNames(styled.container,
                    gameManager.game.player1.mark ? styled.select : styled.deselect),
                mark: classNames(styled.x,
                    gameManager.game.player1.mark ? styled.select : styled.deselect),
            },
            o: {
                container: classNames(styled.container,
                    gameManager.game.player1.mark ? styled.deselect : styled.select),
                mark: classNames(styled.o,
                    gameManager.game.player1.mark ? styled.deselect : styled.select),
            }
        }
    }, [gameManager]);
    const classMarkSelect = getClassMarkSelect();

    const handlerSelectMark = (x: boolean) => {
        const updatedGameManager = controller.updateValues('game.player1.mark', x);
        setGameManager(updatedGameManager);
    }

    const handlerSelectGame = (value: 'multiplayer' | 'solo') => {

        if (value === 'solo' && socket.active) {
            socket.emit('closed', gameManager.server.code, gameManager.server.client);
            socket.disconnect();
        }
        const updatedGameManager = controller.updateValues('game.type', value)
        setGameManager(updatedGameManager);
    }

    return (
        <main className={styled.main}>
            <img className={styled.logo} src={logo} alt="logo" />
            <div className={styled['container-select-mark']}>
                <h1 className={styled.pick}>PICK PLAYER 1’S MARK</h1>
                <div className={styled['container-pick']}>
                    <div onClick={() => handlerSelectMark(true)} className={classMarkSelect.x.container}>
                        <div className={classMarkSelect.x.mark} />
                    </div>
                    <div onClick={() => handlerSelectMark(false)} className={classMarkSelect.o.container}>
                        <div className={classMarkSelect.o.mark} />
                    </div>
                </div>
                <p className={styled['remember']}>REMEMBER : X GOES FIRST</p>
            </div>
            <div className={styled['container-playgame']}>
                <Link className={styled['Link']} to='/game'>
                    <button onClick={() => handlerSelectGame('solo')} className={styled.cpu} type="button" aria-label='New Game Versus CPU'>NEW GAME (VS CPU)</button>
                </Link>
                <Link className={styled['Link']} to='/connecthost'>
                    <button onClick={() => handlerSelectGame('multiplayer')} className={styled.player} type="button" aria-label='New Game Versus Player'>NEW GAME  (VS PLAYER)</button>
                </Link>
            </div>
        </main >
    );
}

export default NewGame;
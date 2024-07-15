import React, { useCallback, useEffect } from 'react';
import styled from './newgame.module.scss';
import logo from '../../assets/images/logo.svg';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { useGameManager } from '../../Context/GameManager/GameManager';
import ControllerGameManager from '../../Context/GameManager/GameMangerUtils';
import { getDefaultGameManager, IGameManager } from '../../Context/GameManager/IGameManager';

function NewGame() {
    const navigate = useNavigate();
    const { gameManager, setGameManager } = useGameManager();
    const controllerManager = new ControllerGameManager(gameManager);

    useEffect(() => {
        const resetGame: IGameManager = getDefaultGameManager();
        setGameManager(
            controllerManager.updateValuesArray(
                ['game.player1', 'game.player2'],
                [gameManager.game.player1, gameManager.game.player2],
                resetGame
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getClassMarkSelect = useCallback(() => {
        return {
            x: {
                container: classNames(
                    styled.container,
                    gameManager.game.player1.mark ? styled.select : styled.deselect
                ),
                mark: classNames(
                    styled.x,
                    gameManager.game.player1.mark ? styled.select : styled.deselect
                ),
            },
            o: {
                container: classNames(
                    styled.container,
                    gameManager.game.player1.mark ? styled.deselect : styled.select
                ),
                mark: classNames(
                    styled.o,
                    gameManager.game.player1.mark ? styled.deselect : styled.select
                ),
            },
        };
    }, [gameManager]);
    const classMarkSelect = getClassMarkSelect();

    const handlerSelectMark = (x: boolean) => {
        setGameManager(
            controllerManager.updateValuesArray(['game.player1.mark'], [x], gameManager)
        );
    };

    const handlerSelectGame = (value: 'solo' | 'multiplayer') => {
        if (value === 'solo') {
            setGameManager(
                controllerManager.updateValuesArray(
                    ['game.player2.playerType', 'game.type'],
                    ['cpu', value], gameManager)
            );
        } else if (value === 'multiplayer') {
            setGameManager(
                controllerManager.updateValuesArray(
                    ['game.player2.playerType', 'game.type'],
                    ['user', value], gameManager)
            );
        }
    };

    // impede que retorne de forma indevida para pagina do jogo.
    const preventBack = (event: any) => {
        if (window.location.pathname === '/game/panels') {
            event.preventDefault();
            navigate('/');
            setTimeout(() => window.location.reload(), 0);
        }
    };

    window.addEventListener('popstate', preventBack);

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
                    <button
                        onClick={() => handlerSelectGame('solo')}
                        className={styled.cpu}
                        type="button"
                        aria-label='New Game Versus CPU'
                    >
                        NEW GAME (VS CPU)
                    </button>
                </Link>
                <Link className={styled['Link']} to='/connecthost'>
                    <button
                        onClick={() => handlerSelectGame('multiplayer')}
                        className={styled.player}
                        type="button"
                        aria-label='New Game Versus Player'
                    >
                        NEW GAME (VS PLAYER)
                    </button>
                </Link>
            </div>
        </main>
    );
}

export default NewGame;

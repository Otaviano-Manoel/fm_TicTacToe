import React, { useCallback, useEffect } from 'react';
import styled from './newgame.module.scss';
import logo from '../../assets/images/logo.svg';
import classNames from 'classnames';
import { useGameManager } from '../../Context/GameManager/GameManager';
import ControllerGameManager from '../../Context/GameManager/GameMangerUtils';
import { Link } from 'react-router-dom';

function NewGame() {
    const { gameManager, setGameManager } = useGameManager();
    const controller = new ControllerGameManager(gameManager);

    useEffect(() => {
        const updatedGameManager = controller.updateValues(gameManager, 'game.type', 'none');
        setGameManager(updatedGameManager);
    }, [])

    const getClassMarkSelect = useCallback(() => {
        return {
            x: {
                container: classNames(styled.container, gameManager.game.player1.mark ? styled.select : styled.deselect),
                mark: classNames(styled.x, gameManager.game.player1.mark ? styled.select : styled.deselect),
            },
            o: {
                container: classNames(styled.container, gameManager.game.player1.mark ? styled.deselect : styled.select),
                mark: classNames(styled.o, gameManager.game.player1.mark ? styled.deselect : styled.select),
            }
        }
    }, [gameManager]);
    const classMarkSelect = getClassMarkSelect();

    const handlerOnClik = (x: boolean) => {
        const updatedGameManager = controller.updateValues(gameManager, 'game.player1.mark', x);
        setGameManager(updatedGameManager);
    }

    const handlerSelectGame = (value: 'multiplayer' | 'solo') => {
        const updatedGameManager = controller.updateValues(gameManager, 'game.type', value)
        setGameManager(updatedGameManager);
    }

    return (
        <main className={styled.main}>
            <img className={styled.logo} src={logo} alt="logo" />
            <div className={styled['container-select-mark']}>
                <h1 className={styled.pick}>PICK PLAYER 1’S MARK</h1>
                <div className={styled['container-pick']}>
                    <div onClick={() => handlerOnClik(true)} className={classMarkSelect.x.container}>
                        <div className={classMarkSelect.x.mark} />
                    </div>
                    <div onClick={() => handlerOnClik(false)} className={classMarkSelect.o.container}>
                        <div className={classMarkSelect.o.mark} />
                    </div>
                </div>
                <p className={styled['remember']}>REMEMBER : X GOES FIRST</p>
            </div>
            <div className={styled['container-playgame']}>
                <Link className={styled['Link']} to='/playGame'>
                    <button onClick={() => handlerSelectGame('solo')} className={styled.cpu} type="button" aria-label='New Game Versus CPU'>NEW GAME (VS CPU)</button>
                </Link>
                <button onClick={() => handlerSelectGame('multiplayer')} className={styled.player} type="button" aria-label='New Game Versus Player'>NEW GAME  (VS PLAYER)</button>
            </div>
        </main >
    );
}

export default NewGame;
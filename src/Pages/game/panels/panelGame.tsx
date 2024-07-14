import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styled from './panelGame.module.scss';
import { useGameBoard } from '../../../Context/GameBoard/GameBoard';
import { useGameManager } from '../../../Context/GameManager/GameManager';
import { getDefaultIGameBoard } from '../../../Context/GameBoard/IGameBoard';

function PanelGame() {
    const { gameBoard, setGameBoard } = useGameBoard();
    const { gameManager } = useGameManager();

    // Get class names based on game state
    const getClassName = useCallback(() => {
        return {
            paragraphy: classNames(styled.p, gameBoard.endGame ? (gameBoard.markWinner === undefined ? styled.desactive : '') : styled.desactive),
            mark: {
                icon: classNames(styled.mark, gameBoard.markWinner ?
                    (gameBoard.markWinner ? styled.x : styled.o) : styled.desactive),
                color: classNames(styled.title, gameBoard.markWinner ?
                    (gameBoard.markWinner ? styled.x : styled.o) : styled.nonewinner),
            }
        };
    }, [gameBoard]);

    // Get texts for the panel based on game state and type
    const getTextsPanel = useCallback(() => {
        let textWinner = 'YOU WIN!';
        let titleWinner = 'TAKES THE ROUND';
        let textopt1 = 'QUIT';
        let textopt2 = 'NEXT ROUND';

        if (gameManager.game.type === 'solo') {
            if (gameBoard.markWinner !== undefined) {
                if (gameManager.game.player1.mark !== gameBoard.markWinner) {
                    textWinner = 'OH NO, YOU LOST...';
                }
            }
        }

        if (gameBoard.markWinner === undefined) {
            titleWinner = 'ROUND TIED';
        }

        if (!gameBoard.endGame) {
            titleWinner = 'RESTART GAME?';
            textopt1 = 'NO, CANCEL';
            textopt2 = 'YES, RESTART';
        }

        return {
            textWinner,
            titleWinner,
            textopt1,
            textopt2
        };
    }, [gameBoard, gameManager]);

    // Handle click events for the options
    const handlerOnClick = (opt: boolean) => {
        if (opt) {
            const newGame = getDefaultIGameBoard();
            newGame.startGame = true;
            setGameBoard(newGame);
        }
    };

    return (
        <section className={styled.panel}>
            <div className={styled.background}>
                <p className={getClassName().paragraphy}>{getTextsPanel().textWinner}</p>
                <h2 className={getClassName().mark.color}>
                    <div className={getClassName().mark.icon} />
                    {getTextsPanel().titleWinner}
                </h2>
                <div className={styled.options}>
                    <Link onClick={() => handlerOnClick(false)} to={gameBoard.endGame ? '/' : '/game'}>
                        <button className={styled.opt1} type="button">{getTextsPanel().textopt1}</button>
                    </Link>
                    <Link onClick={() => handlerOnClick(true)} to='/game'>
                        <button className={styled.opt2} type="button">{getTextsPanel().textopt2}</button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default PanelGame;

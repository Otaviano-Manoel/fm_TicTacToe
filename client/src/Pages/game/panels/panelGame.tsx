import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styled from './panelGame.module.scss';
import { useGameBoard } from '../../../context/GameBoardContext';
import { useGameManager } from '../../../context/GameManager';
import { getDefaultIGameBoard } from '../../../interface/IGameBoard';
import { useSocket } from '../../../context/Socket';

function PanelGame() {
    const { gameBoard, setGameBoard } = useGameBoard();
    const { gameManager } = useGameManager();
    const socket = useSocket();

    // Get class names based on game state
    const getClassName = useCallback(() => {
        return {
            paragraphy: classNames(styled.p, gameBoard.endGame ? (gameBoard.markWinner === undefined ? styled.desactive : '') : styled.desactive),
            mark: {
                icon: classNames(styled.mark, gameBoard.markWinner !== undefined ?
                    (gameBoard.markWinner ? styled.x : styled.o) : styled.desactive),
                color: classNames(styled.title, gameBoard.markWinner !== undefined ?
                    (gameBoard.markWinner ? styled.x : styled.o) : styled.nonewinner),
            }
        };
    }, [gameBoard]);

    const getLinkTo = useCallback(() => {
        let to = {
            quit: '',
            next: ''
        };
        if (gameManager.game.type === 'solo') {
            to.quit = gameBoard.endGame ? '/' : '/game';
        }

        if (gameManager.game.type === 'multiplayer') {
            if (gameManager.server.host) {
                to.quit = gameBoard.endGame ? '/' : '/game';
                to.next = '..';
            }
            else if (gameManager.server.client) {
                to.quit = to.quit = gameBoard.endGame ? '' : '..';
            }
        }
        return to;
    }, [gameBoard.endGame, gameManager.game.type, gameManager.server.client, gameManager.server.host]);

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
        if (gameManager.game.type === 'multiplayer') {
            if (gameBoard.markWinner !== undefined) {
                if (gameManager.game.player1.mark === gameBoard.markWinner) {
                    textWinner = 'PLAYER 1 WINS!';
                }
                else if (gameManager.game.player2.mark === gameBoard.markWinner) {
                    textWinner = 'PLAYER 2 WINS!';
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
            if (gameManager.game.type === 'multiplayer') {
                if (gameManager.server.client) return;
                if (gameBoard.endGame) {
                    socket.emit('nextGame', gameManager.server.code, '/game');
                }
                else {
                    socket.emit('nextGame', gameManager.server.code, '');
                }
            }
            const newGame = getDefaultIGameBoard();
            newGame.numberWins.o = gameBoard.numberWins.o;
            newGame.numberWins.ties = gameBoard.numberWins.ties;
            newGame.numberWins.x = gameBoard.numberWins.x;
            newGame.startGame = true;
            setGameBoard(newGame);
        }
        else {
            if (gameManager.server.client) {
                return;
            }
            if (gameManager.game.type === 'multiplayer') {
                socket.emit('quitGame', gameManager.server.code, '/');
            }
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
                    <Link onClick={() => handlerOnClick(false)} to={getLinkTo().quit}>
                        <button className={styled.opt1} type="button">{getTextsPanel().textopt1}</button>
                    </Link>
                    <Link onClick={() => handlerOnClick(true)} to={getLinkTo().next}>
                        <button className={styled.opt2} type="button">{getTextsPanel().textopt2}</button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default PanelGame;

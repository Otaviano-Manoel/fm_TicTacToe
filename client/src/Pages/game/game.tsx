import React, { useCallback, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styled from './game.module.scss';
import logo from '../../assets/images/logo.svg';
import restart from '../../assets/images/icon-restart.svg';
import { useGameManager } from '../../context/GameManager';
import { useGameBoard } from '../../context/GameBoardContext';
import ControllerGameBoard from '../../utils/GameBoardUtils';
import { calculateWinner } from '../../utils/GameUtils';
import CPU from './CPU/cpu';

function Game() {
    const { gameManager } = useGameManager();
    const { gameBoard, setGameBoard } = useGameBoard();
    const navigate = useNavigate();
    const controller = new ControllerGameBoard(gameBoard);

    // Handle CPU move in solo game
    useEffect(() => {
        if (gameManager.game.type === 'solo') {
            const move = moveCPU();
            if (move !== undefined) {
                selectField(move);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameBoard, gameManager]);

    // Initialize game state
    useEffect(() => {
        if (!gameBoard.startGame) {
            setGameBoard(controller.updateValues(gameBoard, 'startGame', true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Generate class names for field marks
    const getClassFieldMark = useCallback((i: number) => {
        if (!gameBoard.fields[i].marked) {
            return classNames(gameBoard.turn ? styled['outiline-x'] : styled['outiline-o']);
        }
        return classNames(gameBoard.fields[i].styled);
    }, [gameBoard]);

    // Generate class names for fields
    const getClassField = useCallback((i: number) => {
        return classNames(styled.field, gameBoard.fields[i].winner ?
            (gameBoard.fields[i].mark ? styled['win-x'] : styled['win-o']) : '');
    }, [gameBoard]);

    const classTurn = classNames(styled.mark, gameBoard.turn ? styled.x : styled.o);

    // Handle field click event
    const handlerOnClick = (i: number) => {
        if (gameManager.game.type === 'solo' && gameManager.game.player1.mark !== gameBoard.turn) {
            return;
        }
        if (!selectField(i)) return;

        if (gameManager.game.type === 'multiplayer') {
            console.log('implementar o segundo jogador, (faltando)')
        }
    };

    // Select a field and update game state
    const selectField = (i: number): boolean => {
        if (!gameBoard.fields[i].marked) {
            const updateBoard = controller.updateValues(gameBoard, `fields.${i}.marked`, true);
            updateBoard.fields[i].mark = updateBoard.turn;
            updateBoard.fields[i].styled = classNames(updateBoard.turn ? styled['x'] : styled['o']);

            const calculateVictory = () => {
                const position = calculateWinner(updateBoard);
                if (position) {
                    position.forEach(e => {
                        e.forEach(f => {
                            updateBoard.fields[f].winner = true;
                            updateBoard.fields[f].styled = classNames(updateBoard.turn ? styled['x'] : styled['o'], styled['win']);
                        });
                    });
                    updateBoard.endGame = true;
                    updateBoard.markWinner = updateBoard.turn;
                    if (updateBoard.turn) {
                        updateBoard.numberWins.x++;
                    } else {
                        updateBoard.numberWins.o++;
                    }
                    navigate('panels');
                } else if (updateBoard.fields.every(e => e.marked)) {
                    updateBoard.endGame = true;
                    updateBoard.markWinner = undefined;
                    updateBoard.numberWins.ties++;
                    navigate('panels');
                }
            };
            calculateVictory();

            updateBoard.turn = !updateBoard.turn;
            setGameBoard(updateBoard);
            return true;
        }
        return false;
    };

    // Create fields for the game board
    const createFields = (): JSX.Element[] => {
        let fields: JSX.Element[] = [];
        for (let i = 0; i < 9; i++) {
            fields.push(
                <button className={getClassField(i)} key={i} aria-label='field to mark' type="button">
                    <div onClick={() => handlerOnClick(i)} key={i} className={getClassFieldMark(i)} />
                </button>
            );
        }
        return fields;
    };

    // Determine the CPU move
    const moveCPU = (): number | undefined => {
        if (gameManager.game.player2.mark === gameBoard.turn && gameBoard.startGame && !gameBoard.endGame) {
            const move = new CPU(gameBoard, gameManager.game.player2.mark).findBestMove();
            if (move === -1) return undefined;
            return move;
        }
        return undefined;
    };

    return (
        <main className={styled.main}>
            <div className={styled.header}>
                <img className={styled.logo} src={logo} alt="Logo" />
                <div className={styled['turn-container']}>
                    <div className={classTurn} />
                    <p className={styled.turn}>TURN</p>
                </div>
                <Link to={'panels'} className={styled.Link}>
                    <img className={styled.restart} src={restart} alt="Restart Game" />
                </Link>
            </div>

            <div className={styled['field-container']}>
                {createFields()}
            </div>

            <div className={styled.footer}>
                <div className={styled.x}>
                    <p>X ({gameManager.game.player1.mark ? 'YOU' : 'CPU'})<span className={styled.wins}>{gameBoard.numberWins.x}</span></p>
                </div>
                <div className={styled.ties}>
                    <p>TIES<span className={styled.wins}>{gameBoard.numberWins.ties}</span></p>
                </div>
                <div className={styled.o}>
                    <p>O ({gameManager.game.player1.mark ? 'CPU' : 'YOU'})<span className={styled.wins}>{gameBoard.numberWins.o}</span></p>
                </div>
            </div>
            <Outlet />
        </main>
    );
}

export default Game;

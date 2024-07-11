import React, { useCallback, useEffect, useState } from 'react';
import styled from './game.module.scss';
import logo from '../../assets/images/logo.svg';
import restart from '../../assets/images/icon-restart.svg';
import { useGameManager } from '../../Context/GameManager/GameManager';
import classNames from 'classnames';
import { useGameBoard } from '../../Context/GameBoard/GameBoard';
import ControllerGameBoard from '../../Context/GameBoard/GameBoardUtils';
import { calculateWinner } from './GameUtils';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import SoloGame from './solo/soloGame';
import { IGame } from '../../Interface/IGame';

function Game() {

    const { gameManager } = useGameManager();
    const { gameBoard, setGameBoard } = useGameBoard();
    const navigate = useNavigate();
    const [typeGame, setTypeGame] = useState<IGame | undefined>();
    const controller = new ControllerGameBoard(gameBoard);

    useEffect(() => {
        if (typeGame) {
            const move = typeGame.move(gameBoard, gameManager);
            if (move !== undefined) {
                selectField(move);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameBoard, gameManager])

    useEffect(() => {
        if (gameManager.game.type === 'solo') {
            setTypeGame(new SoloGame());
        }
        else if (gameManager.game.type === 'multiplayer') {

        }
        if (!gameBoard.startGame) {
            const update = controller.updateValues(gameBoard, 'startGame', true);
            setGameBoard(update);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getClassFieldMark = useCallback((i: number) => {
        if (!gameBoard.fields[i].marked) {
            return classNames(gameBoard.turn ? styled['outiline-x'] : styled['outiline-o']);
        };
        return classNames(gameBoard.fields[i].styled);
    }, [gameBoard]);

    const classTurn = classNames(styled.mark, gameBoard.turn ? styled.x : styled.o);

    const getClassField = useCallback((i: number) => {
        return classNames(styled.field, gameBoard.fields[i].winner ?
            (gameBoard.fields[i].mark ? styled['win-x'] : styled['win-o']) : '');
    }, [gameBoard]);

    const handlerOnClick = (i: number) => {
        if (gameManager.game.player1.mark !== gameBoard.turn) return;
        selectField(i);
    }

    const selectField = (i: number) => {
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
                        })
                    });
                    updateBoard.endGame = true;
                    updateBoard.markWinner = updateBoard.turn;
                    navigate('panels')
                }
                else if (updateBoard.fields.every(e => e.marked)) {
                    updateBoard.endGame = true;
                    updateBoard.markWinner = undefined;
                    navigate('panels')
                }
            }
            calculateVictory();

            updateBoard.turn = !updateBoard.turn;
            setGameBoard(updateBoard);
        }
    }

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
    }

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
                    <p>X ({gameManager.game.player1.mark ? 'YOU' : 'CPU'})<span className={styled.wins}>0</span></p>
                </div>
                <div className={styled.ties}>
                    <p>TIES<span className={styled.wins}>0</span></p>
                </div>
                <div className={styled.o}>
                    <p>O ({gameManager.game.player1.mark ? 'CPU' : 'YOU'})<span className={styled.wins}>0</span></p>
                </div>
            </div>
            <Outlet />
        </main>
    );
}

export default Game;
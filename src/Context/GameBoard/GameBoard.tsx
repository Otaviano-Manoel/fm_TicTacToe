import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { defaultIGameBoard, IGameBoard } from './IGameBoard';

const GameBoardContext = createContext<{ gameBoard: IGameBoard, setGameBoard: Dispatch<SetStateAction<IGameBoard>> } | undefined>(undefined);

export const useGameBoard = () => {
    const context = useContext(GameBoardContext);
    if (context === undefined) {
        throw new Error('useGameBoard must be used within a GameBoardProvider');
    }
    return context;
}

interface GameBoardProps {
    children: ReactNode;
}

function GameBoard(props: GameBoardProps) {

    const [gameBoard, setGameBoard] = useState<IGameBoard>(() => {
        const local = localStorage.getItem('LOCAL_GAME_BOARD');
        if (!local) {
            return { ...defaultIGameBoard };
        }

        return JSON.parse(local!) as IGameBoard;
    });

    useEffect(() => {
        localStorage.setItem('LOCAL_GAME_BOARD', JSON.stringify(gameBoard));
    }, [gameBoard])

    return (
        <GameBoardContext.Provider value={{ gameBoard, setGameBoard }}>
            {props.children}
        </GameBoardContext.Provider>
    );
}

GameBoard.propTypes = {
    children: PropTypes.node,
};

export default GameBoard;

import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { defaultIGameManager, IGameManager } from './IGameManager';

const GameMangerContext = createContext<{ gameManager: IGameManager, setGameManager: Dispatch<SetStateAction<IGameManager>> } | undefined>(undefined);

export const useGameManager = () => {
    const context = useContext(GameMangerContext);
    if (context === undefined) {
        throw new Error('useGameManager must be used within a GameManagerProvider');
    }
    return context;
}

interface GameManagerProps {
    children: ReactNode;
}

function GameManager(props: GameManagerProps) {

    const [gameManager, setGameManager] = useState<IGameManager>(() => {

        const local = localStorage.getItem('LOCAL_GAME_MANAGER');
        if (!local) {
            return defaultIGameManager;
        }

        return JSON.parse(local!) as IGameManager;
    });

    return (
        <GameMangerContext.Provider value={{ gameManager, setGameManager }}>
            {props.children}
        </GameMangerContext.Provider>
    );
}

GameManager.propTypes = {
    children: PropTypes.node,
};

export default GameManager;

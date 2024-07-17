import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getDefaultGameManager, IGameManager } from '../interface/IGameManager';

const LOCAL_GAME_MANAGER = 'LOCAL_GAME_MANAGER';

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
    const hasAllKeys = (obj: any, keys: string[]): boolean => {
        return keys.every(key => key in obj);
    };

    const [gameManager, setGameManager] = useState<IGameManager>(() => {

        const local = localStorage.getItem(LOCAL_GAME_MANAGER);
        if (!local) {
            return getDefaultGameManager();
        }
        try {

            const manager = JSON.parse(local!) as IGameManager;
            const defaultKeys = Object.keys(getDefaultGameManager());

            if (hasAllKeys(manager, defaultKeys)) {
                return manager;
            }
            else {
                console.warn('O objeto gameManager recuperado não contém todas as chaves esperadas. Usando o valor padrão.');
                return getDefaultGameManager();
            }
        }
        catch {
            return getDefaultGameManager();
        }
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_GAME_MANAGER, JSON.stringify(gameManager));
    }, [gameManager])

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

import { IGameManager } from '../interface/IGameManager';

class ControllerGameManager {
    public static updateValues = (
        keyPaths: string[],
        values: any[],
        obj: IGameManager
    ): IGameManager => {
        if (keyPaths.length !== values.length) {
            throw new Error(
                'The keyPaths and values arrays must have the same length.'
            );
        }

        let state = { ...obj };

        for (let i = 0; i < keyPaths.length; i++) {
            const path = keyPaths[i];
            const value = values[i];
            state = this.updateValue(path, value, state);
        }

        return state;
    };

    private static updateValue = (
        keyPath: string,
        value: any,
        obj: IGameManager
    ): IGameManager => {
        const keys = keyPath.split('.');
        const newState = { ...obj };

        let current: any = newState;
        for (const key of keys.slice(0, -1)) {
            if (current[key] === undefined) {
                throw new Error(`Key "${key}" does not exist in the object.`);
            }
            current = current[key];
        }

        const finalKey = keys[keys.length - 1];
        if (current[finalKey] === undefined) {
            throw new Error(`Key "${finalKey}" does not exist in the object.`);
        }

        current[finalKey] = value;

        this.handleMarkChange(keys, newState);
        this.handleHostToClientChange(keys, newState);

        return newState;
    };

    private static handleMarkChange(keys: string[], newState: IGameManager) {
        if (keys.includes('player1')) {
            newState.game.player2.mark = !newState.game.player1.mark;
        } else if (keys.includes('player2')) {
            newState.game.player1.mark = !newState.game.player2.mark;
        }
        return newState;
    }

    private static handleHostToClientChange(
        keys: string[],
        newState: IGameManager
    ) {
        if (keys.includes('host')) {
            if (newState.server.host) {
                newState.server.client = !newState.server.host;
            }
        } else if (keys.includes('client')) {
            if (newState.server.client) {
                newState.server.host = !newState.server.client;
            }
        }
        return newState;
    }
}

export default ControllerGameManager;

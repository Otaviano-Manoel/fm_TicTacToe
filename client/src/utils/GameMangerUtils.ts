import { IGameManager } from '../interface/IGameManager';
class ControllerGameManager {
    private state: IGameManager;

    constructor(initialState: IGameManager) {
        this.state = initialState;
    }

    public updateValuesArray = (
        keyPaths: string[],
        values: any[],
        obj: IGameManager
    ) => {
        if (keyPaths.length !== values.length) {
            throw new Error(
                'Os arrays de keyPaths e values devem ter o mesmo tamanho.'
            );
        }

        let state = { ...obj };

        for (let i = 0; i < keyPaths.length; i++) {
            const path = keyPaths[i];
            const value = values[i];

            state = this.updateValues(path, value, state);
        }

        return state;
    };

    private updateValues = <K extends keyof IGameManager>(
        keyPath: string,
        value: any,
        obj: IGameManager | undefined = undefined
    ): IGameManager => {
        const keys = keyPath.split('.') as K[];
        const newState = obj === undefined ? { ...this.state } : obj;

        let current: any = newState;
        keys.slice(0, -1).forEach((key: K) => {
            if (current[key] === undefined) {
                throw new Error(`Key "${key}" does not exist in the object.`);
            }
            current = current[key];
        });

        const finalKey = keys[keys.length - 1];
        if (current[finalKey] === undefined) {
            throw new Error(`Key "${finalKey}" does not exist in the object.`);
        }

        current[finalKey] = value;

        this.handlerChangerMark(keys, newState);
        this.handlerChangerHosttoClient(keys, newState);

        return newState;
    };

    private handlerChangerMark(keys: any, newState: IGameManager) {
        if (keys.includes('player1')) {
            newState.game.player2.mark = !newState.game.player1.mark;
        } else if (keys.includes('player2')) {
            newState.game.player1.mark = !newState.game.player2.mark;
        }
        return newState;
    }

    private handlerChangerHosttoClient(keys: any, newState: IGameManager) {
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

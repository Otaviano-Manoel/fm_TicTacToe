import { IGameManager } from './IGameManager';
class ControllerGameManager {
    private state: IGameManager;

    constructor(initialState: IGameManager) {
        this.state = initialState;
    }

    public updateValues = <K extends keyof IGameManager>(
        keyPath: string,
        value: any
    ): IGameManager => {
        const keys = keyPath.split('.') as K[];
        const newState = { ...this.state };

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
}

export default ControllerGameManager;

import { IGameBoard } from '../interface/IGameBoard';

class ControllerGameBoard {
    private state: IGameBoard;

    constructor(initialState: IGameBoard) {
        this.state = initialState;
    }

    public updateValues = <T extends IGameBoard>(
        obj: T,
        keyPath: string,
        value: any
    ): IGameBoard => {
        const keys = keyPath.split('.') as (keyof any)[];
        const newState = { ...obj };

        let current: any = newState;
        keys.slice(0, -1).forEach((key) => {
            if (current[key] === undefined) {
                throw new Error(
                    `Key "${key.toString()}" does not exist in the object.`
                );
            }
            current = current[key];
        });

        const finalKey = keys[keys.length - 1];
        if (current[finalKey] === undefined) {
            throw new Error(
                `Key "${finalKey.toString()}" does not exist in the object.`
            );
        }
        current[finalKey] = value;

        return newState;
    };

    public getstate(): IGameBoard {
        return this.state;
    }
}

export default ControllerGameBoard;

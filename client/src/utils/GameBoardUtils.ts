import { IGameBoard } from '../interface/IGameBoard';

export const updateValueGameBoard = <T extends IGameBoard>(
    gameBoard: T,
    keyPath: string,
    newValue: any
): T => {
    const keys = keyPath.split('.') as (keyof T)[];
    const newGameBoard = { ...gameBoard };

    let current: any = newGameBoard;
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
    current[finalKey] = newValue;

    return newGameBoard;
};

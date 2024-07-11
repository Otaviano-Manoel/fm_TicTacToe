export interface IGameBoard {
    endGame: boolean;
    startGame: boolean;
    turn: boolean;
    fields: {
        styled: string;
        marked: boolean;
        mark: boolean | null;
        winner: boolean;
    }[];
}

export const defaultIGameBoard: IGameBoard = {
    endGame: false,
    startGame: false,
    turn: true,
    fields: [
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
        { styled: '', marked: false, mark: null, winner: false },
    ],
};

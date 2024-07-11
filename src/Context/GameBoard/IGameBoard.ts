export interface IGameBoard {
    endGame: boolean;
    startGame: boolean;
    turn: boolean;
    markWinner: boolean | undefined;
    numberWins: {
        ties: number;
        x: number;
        o: number;
    };
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
    markWinner: undefined,
    numberWins: {
        ties: 0,
        x: 0,
        o: 0,
    },
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

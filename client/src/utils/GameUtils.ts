import { IGameBoard } from '../interface/IGameBoard';

export const calculateWinner = (gameBoard: IGameBoard) => {
    const markedBoard = gameBoard.fields.map((field) => field.mark);
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const sequences: number[][] = [];

    for (const [a, b, c] of winningCombinations) {
        if (
            markedBoard[a] !== null &&
            markedBoard[a] === markedBoard[b] &&
            markedBoard[a] === markedBoard[c]
        ) {
            sequences.push([a, b, c]);
        }
    }

    return sequences.length > 0 ? sequences : undefined;
};

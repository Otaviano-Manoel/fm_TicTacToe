import { IGameBoard } from '../../Context/GameBoard/IGameBoard';

export const calculateWinner = (gameBoard: IGameBoard) => {
    const getMarkedBoard = gameBoard.fields.map((x) => x.mark);
    const sequenceWinner = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const sequence: [number[]] = [[]];
    let isSequence = false;

    for (const [a, b, c] of sequenceWinner) {
        if (
            getMarkedBoard[a] !== null &&
            getMarkedBoard[b] !== null &&
            getMarkedBoard[c] !== null
        ) {
            if (
                (getMarkedBoard[a] && getMarkedBoard[b] && getMarkedBoard[c]) ||
                (!getMarkedBoard[a] && !getMarkedBoard[b] && !getMarkedBoard[c])
            ) {
                isSequence = true;
                sequence.push([a, b, c]);
            }
        }
    }
    if (isSequence) {
        return sequence;
    } else {
        return undefined;
    }
};

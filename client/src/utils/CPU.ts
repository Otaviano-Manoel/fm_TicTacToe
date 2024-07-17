import { IGameBoard } from '../interface/IGameBoard';

class CPU {
    private board: (boolean | null)[] = [];
    private cpuMark: boolean; // true = x && false = o (tictactoe)

    constructor(gameBoard: IGameBoard, cpuMark: boolean) {
        this.board = gameBoard.fields.map((x) => x.mark);
        this.cpuMark = cpuMark;
    }

    public findBestMove(): number {
        let bestVal = -Infinity;
        let bestMove = -1;

        for (let index = 0; index < this.board.length; index++) {
            if (this.board[index] === null) {
                // Make the move
                this.board[index] = this.cpuMark;
                // Compute evaluation function for this move
                let moveVal = this.minimax(0, false);
                // Undo the move
                this.board[index] = null;

                // If the value of the current move is more than the best value, update best
                if (moveVal > bestVal) {
                    bestMove = index;
                    bestVal = moveVal;
                }
            }
        }

        return bestMove;
    }

    private minimax(depth: number, isMaximizing: boolean): number {
        const score = this.evaluate();

        // If Maximizer has won the game, return evaluated score
        if (score === 10) return score - depth;
        // If Minimizer has won the game, return evaluated score
        if (score === -10) return score + depth;
        // If there are no more moves and no winner, then it is a tie
        if (this.board.every((e) => e !== null)) return 0;

        if (isMaximizing) {
            let best = -Infinity;

            // Traverse all cells
            for (let index = 0; index < this.board.length; index++) {
                if (this.board[index] === null) {
                    // Make the move
                    this.board[index] = this.cpuMark;
                    // Call minimax recursively and choose the maximum value
                    best = Math.max(best, this.minimax(depth + 1, false));
                    // Undo the move
                    this.board[index] = null;
                }
            }
            return best;
        } else {
            let best = Infinity;

            // Traverse all cells
            for (let index = 0; index < this.board.length; index++) {
                if (this.board[index] === null) {
                    // Make the move
                    this.board[index] = !this.cpuMark;
                    // Call minimax recursively and choose the minimum value
                    best = Math.min(best, this.minimax(depth + 1, true));
                    // Undo the move
                    this.board[index] = null;
                }
            }
            return best;
        }
    }

    private evaluate(): number {
        const winningSequences = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const [a, b, c] of winningSequences) {
            if (
                this.board[a] !== null &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                return this.board[a] === this.cpuMark ? 10 : -10;
            }
        }
        return 0;
    }
}

export default CPU;

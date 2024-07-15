import { IGameBoard } from '../interface/IGameBoard';

class CPU {
    private board: (boolean | null)[] = [];
    private mark: boolean = false;

    constructor(gameBoard: IGameBoard, markCPU: boolean) {
        this.board = gameBoard.fields.map((x) => x.mark);
        this.mark = markCPU;
    }

    public findBestMove(): number {
        let bestVal = -Infinity;
        let bestMove = -1;

        for (let index = 0; index < this.board.length; index++) {
            if (this.board[index] === null) {
                this.board[index] = false; // Supomos que false é a marca da CPU
                let moveVal = this.minimax(0, this.mark);
                this.board[index] = null; // Reverte a jogada

                if (moveVal > bestVal) {
                    bestMove = index;
                    bestVal = moveVal;
                }
            }
        }

        return bestMove;
    }

    private minimax(depth: number, isMax: boolean): number {
        const score = this.evaluate();
        if (score === 10) return score - depth;
        if (score === -10) return score + depth;
        if (this.board.every((e) => e !== null)) return 0;

        if (isMax) {
            let best = -Infinity;

            for (let index = 0; index < this.board.length; index++) {
                if (this.board[index] === null) {
                    this.board[index] = false;
                    best = Math.max(best, this.minimax(depth + 1, !isMax));
                    this.board[index] = null; // Reverte a jogada
                }
            }

            return best;
        } else {
            let best = Infinity;

            for (let index = 0; index < this.board.length; index++) {
                if (this.board[index] === null) {
                    this.board[index] = true;
                    best = Math.min(best, this.minimax(depth + 1, !isMax));
                    this.board[index] = null; // Reverte a jogada
                }
            }
            return best;
        }
    }

    private evaluate(): number {
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

        for (const [a, b, c] of sequenceWinner) {
            if (
                this.board[a] !== null &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                return this.board[a] === false
                    ? /* Metodo nivel impossivel*/
                      10
                    : -10;
                /* Metodo nivel baixo
                      Math.round(Math.random()) * 10
                    : -Math.round(Math.random()) * 10;*/
            }
        }
        return 0;
    }
}

export default CPU;

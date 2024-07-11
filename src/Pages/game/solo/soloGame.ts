import { IGameBoard } from '../../../Context/GameBoard/IGameBoard';
import { IGameManager } from '../../../Context/GameManager/IGameManager';
import { IGame } from '../../../Interface/IGame';
import CPU from './CPU/cpu';

class SoloGame implements IGame {
    public move(
        stateBoard: IGameBoard,
        stateManger: IGameManager
    ): number | undefined {
        if (
            stateManger.game.player2.mark === stateBoard.turn &&
            stateBoard.startGame &&
            !stateBoard.endGame
        ) {
            const move = new CPU(
                stateBoard,
                stateManger.game.player2.mark
            ).findBestMove();

            if (move === -1) return undefined;

            return move;
        }
        return undefined;
    }
}

export default SoloGame;

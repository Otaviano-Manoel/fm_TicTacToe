import { IGameBoard } from '../Context/GameBoard/IGameBoard';
import { IGameManager } from '../Context/GameManager/IGameManager';

export interface IGame {
    move(
        stateBoard: IGameBoard,
        stateManager: IGameManager
    ): number | undefined;
}

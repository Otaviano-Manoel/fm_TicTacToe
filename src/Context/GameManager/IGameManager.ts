export interface IGameManager {
    game: {
        type: 'multiplayer' | 'solo' | 'none';
        player1: {
            playerType: 'user' | 'cpu';
            mark: boolean;
        };
        player2: {
            playerType: 'user' | 'cpu';
            mark: boolean;
        };
    };
}

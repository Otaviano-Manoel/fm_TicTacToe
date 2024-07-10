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

export const defaultIGameManager: IGameManager = {
    game: {
        type: 'none',
        player1: {
            playerType: 'user',
            mark: true,
        },
        player2: {
            playerType: 'user',
            mark: false,
        },
    },
};

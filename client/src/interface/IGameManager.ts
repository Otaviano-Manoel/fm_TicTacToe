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

    server: {
        code: number | null;
        host: boolean;
        client: boolean;
        move: number | null;
    };

    sound: {
        play: boolean;
        click: boolean;
        win: boolean;
        draw: boolean;
        lose: boolean;
    };
}

export const getDefaultGameManager = (): IGameManager => {
    const defaultGameManager: IGameManager = {
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
        server: {
            code: null,
            host: false,
            client: false,
            move: null,
        },
        sound: {
            play: false,
            click: false,
            win: false,
            draw: false,
            lose: false,
        },
    };

    return defaultGameManager;
};

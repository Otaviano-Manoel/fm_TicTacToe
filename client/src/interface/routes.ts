export const getBackRoutes = () => {
    const gamebackroute = new Map();
    gamebackroute.set('/', []);
    gamebackroute.set('/game', ['/', '/connect']);
    gamebackroute.set('/connect', ['/']);
    gamebackroute.set('/game/panels', ['/game', '/']);
    return gamebackroute;
};

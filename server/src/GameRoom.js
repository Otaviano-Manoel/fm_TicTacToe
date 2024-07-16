class GameRoom {
    constructor(id, player1) {
        this.id = id;
        this.player1 = player1;
        this.player2 = null;
    }

    addPlayer2(player2) {
        if (this.player2) {
            throw new Error('Player2 already in the room');
        }
        this.player2 = player2;
        return '';
    }

    removePlayer2() {
        if (!this.player2) {
            throw new Error('Player not found in the room');
        }
        this.player2 = null;
        return '';
    }

    isFull() {
        return this.player1 !== null && this.player2 !== null;
    }

    getPlayers() {
        return {
            player1: this.player1,
            player2: this.player2,
        };
    }
}

module.exports = GameRoom;

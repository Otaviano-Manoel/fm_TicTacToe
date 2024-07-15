import { expect } from 'chai';
import GameRoom from '../src/GameRoom.js';

describe('GameRoom', () => {
    it('should create a game room with player1', () => {
        const player1 = { id: 'player1' };
        const id = { id: 'XYZ' };
        const room = new GameRoom(id, player1);

        expect(room.player1).to.equal(player1);
        expect(room.id).to.equal(id);
        expect(room.player2).to.be.null;
    });

    it('should add player2 to the room', () => {
        const player1 = { id: 'player1' };
        const player2 = { id: 'player2' };
        const room = new GameRoom(player1);

        room.addPlayer2(player2);
        expect(room.player2).to.equal(player2);
    });

    it('should not add player2 if already present', () => {
        const player1 = { id: 'player1' };
        const player2 = { id: 'player2' };
        const room = new GameRoom(player1);

        room.addPlayer2(player2);
        expect(() => room.addPlayer2(player2)).to.throw(
            'Player2 already in the room'
        );
    });

    it('should remove player2 from the room', () => {
        const player1 = { id: 'player1' };
        const player2 = { id: 'player2' };
        const room = new GameRoom(player1);

        room.addPlayer2(player2);
        room.removePlayer2();
        expect(room.player2).to.be.null;
    });

    it('should return if the room is full', () => {
        const player1 = { id: 'player1' };
        const player2 = { id: 'player2' };
        const room = new GameRoom(player1);

        expect(room.isFull()).to.be.false;
        room.addPlayer2(player2);
        expect(room.isFull()).to.be.true;
    });
});

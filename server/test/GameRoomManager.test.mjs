import { expect } from 'chai';
import GameRoomsManager from '../src/GameRoomsManager.js';
import GameRoom from '../src/GameRoom.js';

describe('GameRoomsManager', () => {
    let manager;

    beforeEach(() => {
        manager = new GameRoomsManager();
    });

    it('should create a new room', () => {
        const player1 = { id: 'player1' };
        const room = manager.createRoom(player1);

        expect(room).to.be.instanceOf(GameRoom);
        expect(manager.getRoom(room.id)).to.equal(room);
    });

    it('should get an existing room', () => {
        const player1 = { id: 'player1' };
        const room = manager.createRoom(player1);

        const retrievedRoom = manager.getRoom(room.id);
        expect(retrievedRoom).to.equal(room);
    });

    it('should delete an existing room', () => {
        const player1 = { id: 'player1' };
        const room = manager.createRoom(player1);

        manager.deleteRoom(room.id);
        expect(() => manager.getRoom(room.id)).to.throw(
            'Room not found or invalid type'
        );
    });

    it('should list all rooms', () => {
        const player1 = { id: 'player1' };
        manager.createRoom(player1);

        const rooms = manager.listRooms();
        expect(rooms).to.have.lengthOf(1);
    });
});

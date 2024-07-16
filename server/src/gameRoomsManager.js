const GameRoom = require('./GameRoom');

const generateUniqueCode = (existingCodes) => {
    let code;

    do {
        code = Math.random().toString(36).substring(2, 6).toUpperCase();
    } while (existingCodes.has(code));
    return code;
};

class GameRoomsManager {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(player1) {
        const id = generateUniqueCode(this.rooms);
        const newRoom = new GameRoom(id, player1);
        this.rooms.set(id, newRoom);
        return newRoom;
    }

    getRoom(id) {
        const room = this.rooms.get(id);
        if (room instanceof GameRoom) {
            return room;
        } else {
            throw new Error('Room not found or invalid type');
        }
    }

    deleteRoom(id) {
        if (!this.rooms.has(id)) {
            throw new Error('Room not found');
        }
        this.rooms.delete(id);
    }

    listRooms() {
        return Array.from(this.rooms.values());
    }
}

module.exports = GameRoomsManager;

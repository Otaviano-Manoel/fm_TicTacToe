const GameRoom = require('./GameRoom');

const generateUniqueCode = (existingCodes) => {
    const maxRooms = 50; // Máximo de salas permitidas
    if (existingCodes.size >= maxRooms) {
        throw new Error('Maximum number of rooms reached');
    }
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
        try {
            const id = generateUniqueCode(this.rooms);
            const newRoom = new GameRoom(id, player1);
            this.rooms.set(id, newRoom);
            return newRoom;
        } catch (error) {
            console.error(error.message);
            return null;
        }
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
        try {
            if (!this.rooms.has(id)) {
                throw new Error('Room not found');
            }
            this.rooms.delete(id);
        } catch (error) {
            console.log(error.message);
        }
    }

    listRooms() {
        return Array.from(this.rooms.values());
    }
}

module.exports = GameRoomsManager;

const { disconnectHandler, touchHandler, joinRoomHandler } = require('./game-handlers');


class GameApp {
    rooms = {};
    io = null
    constructor(inputIO) {
        this.io = inputIO;
        this.io.on('connection',  (socket) => { 
            socket.on('disconnect', () => disconnectHandler.call(this,socket));
            socket.on('touch', (data) => touchHandler.call(this,socket,data));
            socket.on('joinroom', (data) => joinRoomHandler.call(this,socket,data));
        });
    }
    sendToRoom(roomId, event, data) {
        this.io.to(roomId).emit(event, data);
    }
    getRooms() {
        return this.rooms;
    }
}


module.exports = GameApp
const { GAME_START_TIME, GAME_LIFE_TIME, GAME_STATUSES } = require("./consts");
const { getWinner } = require("./helpers");

const disconnectHandler = function(socket){
        for (let room in this.rooms) {
            if (this.rooms[room].users.indexOf(socket.id) > -1) {
                this.rooms[room].users.splice(this.rooms[room].users.indexOf(socket.id), 1);
                console.log('disconnect', socket.id);
                this.sendToRoom(room,'user-disconneted', {
                    user: socket.id,
                    users: this.rooms[room].users
                });
            }
        }
}

/**
 * receive the player's touch
 * @param {*} socket 
 * @param {*} data 
 * @returns 
 */
const touchHandler = function(socket, data){
        const {touchId} = data
        // find user in rooms
        const room =  Object.values(this.rooms).find(r=> r.users.indexOf(socket.id) > -1)
        if(!room) return;
        // user alredy submit
        if(this.rooms[room.id].gameResult[socket.id]) return
        this.rooms[room.id].gameResult[socket.id] = touchId;
}


/**
 * the user join the room
 * @param {*} socket 
 * @param {*} data 
 * @returns 
 */
const joinRoomHandler = function(socket, data){
  
        const {roomId} = data
        // get or init room
        this.rooms[roomId] = this.rooms[roomId] || {
            id: roomId,
            users: [],
            status: 'none',
            gameResult: {},
            finalResult: null
        }

        // check room status
        if(this.rooms[roomId].status == GAME_STATUSES.STARTED) return;

        // add new user to the room
        if(this.rooms[roomId].users.length < 2) {
            console.log('joinroom', roomId, socket.id);
            this.rooms[roomId].users.push(socket.id)
            socket.join(roomId)
            process.nextTick(() => {
                this.sendToRoom(roomId,'joined', {
                    roomId: roomId,
                    users: this.rooms[roomId].users,
                })
            })
        }
        
        
        // we can start the game now
        if(this.rooms[roomId].users.length === 2) {

            process.nextTick(() => {
                // send pre-start status to let the client show the counte down
                this.sendToRoom(roomId,'game-status', {
                    roomId: roomId,
                    users: this.rooms[roomId].users,
                    date: new Date(),
                    startIn: GAME_START_TIME / 1000,
                    status: GAME_STATUSES.PRESTARTED
                })

                this.rooms[roomId].status = GAME_STATUSES.PRESTARTED;


                setTimeout(()=>{
                    this.rooms[roomId].status = GAME_STATUSES.STARTED;
                    this.sendToRoom(roomId,'game-status', {
                        status: GAME_STATUSES.STARTED
                    });
                }, GAME_START_TIME);


                // finish the game after GAME_START_TIME + GAME_LIFE_TIME since this
                // is the time we need to get the winner
                setTimeout(()=>{
                    this.rooms[roomId].status = GAME_STATUSES.FINISHED;
                    this.rooms[roomId].finalResult = getWinner(this.rooms[roomId].gameResult);
                    this.sendToRoom(roomId,'game-status', {
                        status: GAME_STATUSES.FINISHED,
                        gameResult: this.rooms[roomId].gameResult,
                        finalResult: this.rooms[roomId].finalResult
                    });
                    // delete the game's room 
                    delete this.rooms[roomId]
                }, GAME_START_TIME + GAME_LIFE_TIME)  
            })
        }
        
        
        if(this.rooms[roomId].status != 'none'){
            console.log('already ', this.rooms[roomId].status);
        }

        
    
}

module.exports ={
    disconnectHandler,
    touchHandler,
    joinRoomHandler
}
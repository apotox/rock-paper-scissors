import { io, Socket } from "socket.io-client";




export default class Client {

    socket: Socket;
    id: string = null
    connected: boolean = false;


    close(){
        this.socket.close()
    }

    constructor(roomId: string) {
        this.socket = io();


        this.socket.on("connect", () => {
            console.log('connected', this.socket.id); // true
            this.id = this.socket.id;
            this.connected = true;

            this.socket.emit('joinroom', {
                roomId
            })
        });

        this.socket.on("disconnect", () => {
            console.log('disconnected'); // true
            this.id = null
            this.connected = false;
        });


    }

    

}


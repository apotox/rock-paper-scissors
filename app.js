
const express = require('express');
const GameApp = require('./game');

const app = express();
const server = require('http').createServer(app);
const IO = require('socket.io')(server);




const gameInstance = new GameApp(IO);


app.get('/rooms', (req, res) => res.json(gameInstance.getRooms()))

app.use(express.static('client'));

server.listen(3000, ()=>{
    console.log('listening on port 3000');
});


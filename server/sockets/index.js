const socketIo = require('socket.io');
const waitingArena = require('./waitingArena');
const interview = require('./interview');

function socketServer(server){
    const io = socketIo(server, {
        cors: {
            origin : "*",
            methods : ["GET", "POST"],
            credentials : true
        }
    });
    waitingArena(io.of("/waiting-arena"));
    interview(io.of("/room"));
}

module.exports = { socketServer };
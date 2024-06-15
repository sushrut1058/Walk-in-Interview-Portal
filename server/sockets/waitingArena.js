const { authenticateSocket } = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');
const roomStates = require('../sharedState');

function waitingArena(waiting_arena){
    waiting_arena.use(authenticateSocket);
    var activeUsers = {};
    var socketMap = new Map();  

    function isSocketInRoom(socketId, roomId) {
        const socket_ = waiting_arena.sockets.get(socketId);
        if (socket_) {
            return socket_.rooms.has(roomId);
        }
        return false;
    } 

    waiting_arena.on('connection', (socket) => {
        console.log("Waiting arena with new socket:", socket.id);

        socket.on("joinRoom",(roomId)=>{
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined Room ${roomId}`);
            
            socketMap.set(socket.user.id, socket.id);

            if(activeUsers[roomId]===undefined) {
                activeUsers[roomId]=[];
            }else{
                const ind = activeUsers[roomId].findIndex(user => user.id===socket.user.id);
                if(ind!==-1){
                    activeUsers[roomId].splice(ind, 1);
                }
            }
            activeUsers[roomId].push({id:socket.user.id, first_name: socket.user.first_name});
            waiting_arena.to(roomId).emit("updateUsers", activeUsers[roomId]);

            socket.on("invite", async (userId) => {
                console.log("Invitation event called");
                const sockid = socketMap.get(userId);
                
                const room = await Room.findOne({
                    where:{
                        userId: socket.user.id,
                        roomId: roomId
                    }
                });

                if(room && room.roomId===roomId && isSocketInRoom(sockid,roomId)){
                    roomStates.setRoomState(roomId, {creator: socket.user.id, attendee: userId})
                    waiting_arena.to(sockid).emit("invitation",{});
                }else{
                    // console.log(userId, sockid, socketMap, activeUsers,roomStates, !room, room.roomId===roomId, isSocketInRoom(sockid,roomId));
                    waiting_arena.to(socket.id).emit("error","Something went wrong, unable to invite candidate.");
                }                
            });

            socket.on("disconnect", ()=>{
                console.log("User disconnected, id: ", socket.user.id);
                socketMap.delete(socket.user.id);
                const index = activeUsers[roomId].findIndex(user => user.id===socket.user.id);
                if(index!==-1){
                    activeUsers[roomId].splice(index, 1);
                    waiting_arena.to(roomId).emit("updateUsers", activeUsers[roomId]);
                }
                 
            });
        })
    });
}





module.exports = waitingArena;
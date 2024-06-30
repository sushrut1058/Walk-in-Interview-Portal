const { authenticateSocket } = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');
const roomStates = require('../sharedState');
const meth = require('./funcs');

function Interview(interview){
    interview.use(authenticateSocket);
    var socketMap = new Map();
    function isSocketInRoom(socketId, roomId) {
        const socket_ = interview.sockets.get(socketId);
        if (socket_) {
            return socket_.rooms.has(roomId);
        }
        return false;
    }

    function loadCurrentState(roomId) {
        var curState = roomStates.getRoomState(roomId);
        if(curState && !(curState.creator)) curState.creator = -1;
        if(curState && !(curState.attendee)) curState.attendee = -1;
        if(!curState) {
            curState={creator:-1, attendee:-1};
        }  
        return curState; 
    }

    interview.on('connection', (socket) => {
        console.log("Room with new socket:", socket.id);
        
        socket.on("joinRoom",(roomId)=>{

            var curState = loadCurrentState(roomId);

            meth.isMember(socket,roomId, ()=>{    
                interview.to(socket.id).emit("authorized", socket.user.role);
                socketMap.set(socket.user.id, socket.id);
                //room join
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined Room ${roomId}`);
                
                socket.on("attendee-joined", () => {
                    console.log("receivedeventattendeejoined");
                    curState = loadCurrentState(roomId);
                    if (socket.id===socketMap.get(curState.attendee)){
                        console.log("receivedeventattendeejoined-true");
                        interview.to(socketMap.get(curState.creator)).emit('attendee-joined', curState.attendee);
                    }else{ 
                        console.log("receivedeventattendeejoined-false");
                        socket.emit("error", "Not an attendee");
                    }
                })

                socket.on("offer", (payload) => {
                    curState = loadCurrentState(roomId);
                    console.log("offer", payload.target, curState.attendee);
                    if(curState.attendee===payload.target){
                        interview.to(socketMap.get(payload.target)).emit("offer", payload);
                    }else{
                        socket.emit("error", "Can't find peer to call!");
                    }
                });

                socket.on("answer", (payload) => {
                    console.log("answer");
                    interview.to(socketMap.get(payload.target)).emit("answer", payload);
                });

                socket.on("ice-candidate", (payload)=>{
                    console.log("ice-candidate");
                    interview.to(socketMap.get(payload.target)).emit("ice-candidate", payload);
                });

                socket.on("remove", (usr_id)=>{
                    curState = loadCurrentState(roomId);
                    try{
                        if(curState && curState.attendee==usr_id)
                        roomStates.setRoomState(roomId, {creator: curState.creator, attendee: -1});
                    }catch (e){
                        console.log("Error removing the user", e);
                    }
                    socket.disconnect();
                });

                socket.on("toggle-video", (msg) => {
                    console.log("toggle video triggered");
                    curState = loadCurrentState(roomId);
                    try{
                        if(curState.creator==socket.user.id) interview.to(socketMap.get(curState.attendee)).emit("toggle-video", msg);
                        else interview.to(socketMap.get(curState.creator)).emit("toggle-video", msg);
                    }catch {
                        console.log("Something went wrong, couldnt send toggle-video signal!");
                    }
                })

            });

            socket.on("disconnect", ()=>{
                curState = loadCurrentState(roomId);
                console.log("User disconnected, id: ", socket.user.id, curState);
                if(curState && curState.creator===socket.user.id){
                    console.log("creator left");
                    roomStates.setRoomState({creator:-1, attendee: curState.attendee});
                }else if(curState && curState.attendee===socket.user.id){
                    console.log("attendee left");
                    roomStates.setRoomState({creator: curState.creator, attendee: -1});
                }else{
                    console.log("[socket-disconnect] Something went wrong!");
                }
            });
        })
    });
}

module.exports = Interview;
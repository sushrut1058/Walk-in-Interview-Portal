const roomStates = require('../sharedState');
const Rooms = require('../models/Room');

exports.isMember = (socket, roomId, next) => {
    const curState = roomStates.getRoomState(roomId);
    if(curState!==undefined && (curState.attendee==socket.user.id || curState.creator==socket.user.id)){
        next();
    }else if(curState ===undefined){
        this.isOwner(socket, roomId, next);
    }else{
        console.log("Not a member, disconnecting");
        socket.emit("unauthorized");
        socket.disconnect();
        return;
    }
}

exports.isOwner = async (socket, roomId, next) => {
    const row = await Rooms.findOne({
        where: {
            userId: socket.user.id,            
            roomId: roomId
        }
    });
    if (row){
        roomStates.setRoomState(roomId, {creator: socket.user.id, attendee: -1});
        next();
    }else{
        socket.emit("unauthorized");
        socket.disconnect();
        return;
    }
}
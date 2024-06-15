// roomStates.js

let roomStates = {};

const getRoomState = (roomId) => {
  return roomStates[roomId];
};

const setRoomState = (roomId, state) => {
  roomStates[roomId] = state;
};

const getAllRoomStates = () => {
  return roomStates;
};

const clearRoomState = (roomId) => {
  delete roomStates[roomId];
};

module.exports = { getRoomState, setRoomState, getAllRoomStates, clearRoomState };

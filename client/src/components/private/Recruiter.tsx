import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import CreateRoom from "./Home/CreateRoom";
import axios from "axios";
import Container from "./Container";
import ActiveRooms from "./Home/ActiveRooms";
import "./css/Recruiter.css"
import RoomHistory from "./Home/RoomHistory";

const sock_url = "http://localhost:8000";

const Recruiter: React.FC = () => {
  
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
  const sockObj = useSocket();
  const [roomId, setRoomId] = useState<string>("");
  const token = localStorage.getItem('access');
  const [activeComp, setActiveComp] = useState<React.ReactElement>();
  const [activeButton, setActiveButton] = useState<string>('');

  if (isLoading){
    return <div>Loading...</div>
  }

  const handleCompSwitch = (component: React.ReactElement, buttonId: string) => {
    setActiveComp(component);
    setActiveButton(buttonId);
  };

  const mes = () =>{
    console.log(sockObj.socket);
    if(sockObj.socket){
      sockObj.socket.emit('message', "Yo harro");
    }
  }
  
  const history = () => {
    console.log("History here");
  }
  
  return (
    <div className="recruiter-page">
        <div className="profile-section">
          <h4>Profile</h4>
          {/* Placeholder for future profile information */}
        </div>
        <div className="controls">
          <div className="bar">
            <button className={activeButton === 'create'? 'active': ''} onClick={() => handleCompSwitch(<CreateRoom/>, 'create')}>Create Room</button>
            <button className={activeButton === 'active'? 'active': ''} onClick={() => handleCompSwitch(<ActiveRooms/>, 'active')}>Active rooms</button>
            <button className={activeButton === 'history'? 'active': ''} onClick={() => handleCompSwitch(<RoomHistory/>, 'create')}>History</button> 
            <button onClick={mes}>Messages</button>
          </div>
          <div className="activeComponent">
            <Container activeComponent={activeComp}/>
          </div>
        </div>
    </div>
  );
};

export default Recruiter;

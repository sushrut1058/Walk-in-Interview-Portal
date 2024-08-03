import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Header from '../components/private/Miscellaneous/Header';
import "./css/Room.css"
import RoomContainer from "../components/private/Room/RoomContainer";


const Room: React.FC = () => {
const { roomId } = useParams<{ roomId: string }>();
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated

  const [activeComponent, setActiveComponent] = useState<string|undefined>('Room');

  if (isLoading){
    return <div>Loading...</div>
  }else{
    console.log("user.id:",user.id, isAuthenticated);
  }
  
  
  const renderComponent = () => {
    switch (activeComponent) {
        case 'Room':
          return <RoomContainer roomId={roomId}/>;
    }
  };
  
  return (
    <div className="rooms_home">
      <Header/>
      <div className="rooms_main-content">
        <div className="rooms_content">
            {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default Room;

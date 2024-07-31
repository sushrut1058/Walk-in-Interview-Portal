import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/private/Header';
import "./css/Room.css"
import SideBar from "../components/private/SideBar";
import RoomContainer from "../components/private/RoomContainer";
import WaitingContainer from "../components/private/WaitingContainer";


const Room: React.FC = () => {
const { roomId } = useParams<{ roomId: string }>();
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
  const [activeComp, setActiveComp] = useState<React.ReactElement>();
  const [activeButton, setActiveButton] = useState<string>('');

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

  const handleCompSwitch = (component: React.ReactElement, buttonId: string) => {
    setActiveComp(component);
    setActiveButton(buttonId);
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





// const WaitingArena: React.FC = () => {
//   const {roomId} = useParams();
//   return (
//     <div>
//       <Header/>
//       <div>
//       <h1>Waiting Arena for Room Id: {roomId}</h1>
//       <h3>Active Users</h3>
//       <Waiting roomId={roomId} />
//       </div>
//     </div>
//   );
// };

export default Room;

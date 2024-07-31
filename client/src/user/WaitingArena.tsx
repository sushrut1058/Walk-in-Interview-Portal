import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import io, { Socket } from "socket.io-client";
import Waiting from '../components/private/Waiting';
import Header from '../components/private/Header';
import "../components/private/css/Recruiter.css"
import SideBar from "../components/private/SideBar";
import WaitingContainer from "../components/private/WaitingContainer";

const sock_url = "http://localhost:5000";

interface User{
  id: string,
  first_name: string
}

const WaitingArena: React.FC = () => {
  const {roomId} = useParams();
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
  const [activeComp, setActiveComp] = useState<React.ReactElement>();
  const [activeButton, setActiveButton] = useState<string>('');

  const [activeComponent, setActiveComponent] = useState<string|undefined>('Waiting Arena');

  if (isLoading){
    return <div>Loading...</div>
  }else{
    console.log("user.id:",user.id, isAuthenticated);
  }
  
  
  const renderComponent = () => {
    switch (activeComponent) {
        case 'Waiting Arena':
          return <WaitingContainer roomId={roomId}/>;
        default:
          return <WaitingContainer roomId={roomId}/>;
    }
  };

  const handleCompSwitch = (component: React.ReactElement, buttonId: string) => {
    setActiveComp(component);
    setActiveButton(buttonId);
  };
  
  return (
    <div className="recruiter_home">
      <Header/>
      <div className="recruiter_main-content">
        <SideBar setActiveComponent={setActiveComponent} activeComponent={activeComponent} compList={["Waiting Arena"]} />
        <div className="recruiter_content">
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

export default WaitingArena;

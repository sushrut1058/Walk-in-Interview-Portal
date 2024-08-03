import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Header from '../components/private/Miscellaneous/Header';
import "../components/private/css/Recruiter.css"
import SideBar from "../components/private/Miscellaneous/SideBar";
import WaitingContainer from "../components/private/Waiting/WaitingContainer";

interface User{
  id: string,
  first_name: string
}

const WaitingArena: React.FC = () => {
  const {roomId} = useParams();
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
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

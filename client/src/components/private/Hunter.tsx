import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ActiveRooms from "./Home/ActiveRooms";
import "./css/Recruiter.css"
import Profile from "./Profile";
import History from "./History";
import Settings from "./Settings";
import SideBar from "./SideBar";
import Header from "./Header";

const sock_url = "http://localhost:5000";

const Recruiter: React.FC = () => {
  
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
  const [activeComp, setActiveComp] = useState<React.ReactElement>();
  const [activeButton, setActiveButton] = useState<string>('');

  const [activeComponent, setActiveComponent] = useState<string|undefined>('Profile');

  if (isLoading){
    return <div>Loading...</div>
  }else{
    console.log("user.id:",user.id, isAuthenticated);
  }
  
  
  const renderComponent = () => {
    switch (activeComponent) {
        case 'Profile':
            return <Profile userId={user.id}/>;
        case 'ActiveRooms':
            return <ActiveRooms />;
        case 'History':
            return <History />;
        case 'Settings':
            return <Settings />;
        default:
            return <Profile userId={user.id}/>;
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
        <SideBar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
        <div className="recruiter_content">
            {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default Recruiter;

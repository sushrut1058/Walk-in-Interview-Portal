import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import EmailVerification from "../components/private/EmailVerification";
import Onboard from "../components/private/Onboard";
import Hunter from "../components/private/Hunter";
import Recruiter from "../components/private/Recruiter";
import { SocketProvider } from "../contexts/SocketContext";
import logOutIcon from "../static/logout.png"
import "./css/HomePage.css"

const HomePage: React.FC = () => {
  
  const auth = useAuth();
  const handleLogout = () => {
    auth.logOut();
  }
  console.log(auth.user);
  return (
    <div className="home-page">
      <header className="home-header">
        <h2>Timbre</h2>
        <button onClick={handleLogout} className="logout-button">
          <img src={logOutIcon}/>
        </button>
      </header>
      <div className="content-area">
    {auth.user.active ? 
      
      (
       
        auth.user.role===1 ?
        <SocketProvider>
          <Hunter/>
        </SocketProvider>
        :
        <SocketProvider>
          <Recruiter/>
        </SocketProvider>
      
    )
      
      :
      (auth.user.verified_email===undefined ? 
        
          <Onboard/>
         
        :
        
          <EmailVerification/>
        
    )}
    </div>
    </div>
  );
};

export default HomePage;

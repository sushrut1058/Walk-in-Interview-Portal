import React, { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import EmailVerification from "../components/private/Registration/EmailVerification";
import Onboard from "../components/private/Registration/Onboard";
import Hunter from "../components/private/Hunter";
import Recruiter from "../components/private/Recruiter";
import "./css/HomePage.css"

const HomePage: React.FC = () => {
  
  const auth = useAuth();
  const handleLogout = () => {
    auth.logOut();
  }
  return (
    <div className="content">
        {auth.user.active ? 
          
          (
          
            auth.user.role===1 ?
              <Hunter/>
            :
              <Recruiter/>
        )
          :
        (auth.user.verified_email===undefined ? 
            <Onboard/>
          :
            <EmailVerification/>        
        )}
      </div>
  );
};

export default HomePage;

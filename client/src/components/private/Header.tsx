import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import logOutIcon from "../../static/logout.png"
import "./css/Header.css"

const Header: React.FC = () => {
  
  const auth = useAuth();
  const handleLogout = () => {
    auth.logOut();
  }
  return (
    <div>
      <header className="home-header">
        <h2>Aurora</h2>
        <button onClick={handleLogout} className="logout-button">
          <img src={logOutIcon}/>
        </button>
      </header>
    </div>
  );
};

export default Header;
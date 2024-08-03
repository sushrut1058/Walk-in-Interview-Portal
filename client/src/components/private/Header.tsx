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
    <div className="header">
        <div className="logo">
            <img src="/logo.png" alt="Logo" />
            <span>sawdust</span>
        </div>
    </div>
  );
};

export default Header;
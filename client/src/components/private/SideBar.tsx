import React from 'react';
import './css/SideBar.css';
import Logo from '../../static/logo.png';

interface props {
    setActiveComponent : React.Dispatch<React.SetStateAction<string | undefined>>;
    activeComponent : string | undefined;
}

const SideBar: React.FC<props> = ({ setActiveComponent, activeComponent }) => {
    
    return (
        <div className="sidebar">
            <div className="menu">
                <div className={`menu-item ${activeComponent === 'Profile' ? 'active' : ''}`} onClick={() => setActiveComponent('Profile')}>Profile</div>
                <div className={`menu-item ${activeComponent === 'ActiveRooms' ? 'active' : ''}`} onClick={() => setActiveComponent('ActiveRooms')}>Active Rooms</div>
                <div className={`menu-item ${activeComponent === 'History' ? 'active' : ''}`} onClick={() => setActiveComponent('History')}>History</div>
                <div className={`menu-item ${activeComponent === 'Settings' ? 'active' : ''}`} onClick={() => setActiveComponent('Settings')}>Settings</div>
            </div>
        </div>
    );
};

export default SideBar;

import React from 'react';
import './css/SideBar.css';

interface props {
    setActiveComponent : React.Dispatch<React.SetStateAction<string | undefined>>;
    activeComponent : string | undefined;
    compList: string[];
}

const SideBar: React.FC<props> = ({ setActiveComponent, activeComponent, compList }) => {
    
    return (
        <div className="sidebar">
            <div className="menu">
                {compList.map((component, index) => (
                        <div
                            key={index}
                            className={`menu-item ${activeComponent === component ? 'active' : ''}`}
                            onClick={() => setActiveComponent(component)}
                        >
                            {component}
                        </div>
                ))}

            </div>
        </div>
    );
};

export default SideBar;

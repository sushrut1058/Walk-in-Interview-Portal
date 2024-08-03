import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Header from '../components/private/Miscellaneous/Header';
import "./css/ProfileView.css"
import ProfileContainer from '../components/private/Room/ProfileContainer';


const ProfileView: React.FC = () => {
const { pid } = useParams<{ pid: string }>();
  const { isAuthenticated, user, isLoading} = useAuth(); 

  if (isLoading){
    return <div>Loading...</div>
  }else{
    console.log("user.id:",user.id, isAuthenticated);
  }
  
  
  

  
  
  return (
    <div className="waiting-profile_home">
      <Header/>
      <div className="waiting-profile_main-content">
        <div className="waiting-profile_content">
            <ProfileContainer userId={pid}/>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

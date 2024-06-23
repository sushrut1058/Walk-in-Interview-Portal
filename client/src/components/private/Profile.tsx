import React, {useEffect, useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';
import axios from 'axios';
import './css/Profile.css';

interface profileInfo {
    first_name: string | null;
    last_name: string | null;
    company: string | null;
    linkedin: string | null;
    github: string | null;
}

interface props {
    userId: string | null;
}
const Profile: React.FC<props> = ({userId}) => {
    const [userData, setUserData] = useState<profileInfo>({
        first_name: '',
        last_name: '',
        company:'',
        linkedin:'',
        github:''
    });
    const [cvBlobUrl, setCvBlobUrl] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            const token = await localStorage.getItem('access');
            const response = await axios.get(`http://localhost:8000/actions/profile/${userId}`, {
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            })
            setUserData(response.data);
            console.log(userData);
        }catch (e) {
            console.log("Can't fetch profile data", e);
        }
    }

    const fetchCv = async () => {
        if(cvBlobUrl){
            setCvBlobUrl(null);
            return;
        }
        try {
          const token = await localStorage.getItem('access');
          const response = await axios.get(`http://localhost:8000/actions/cv/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          setCvBlobUrl(url);
        } catch (e) {
          console.log("Can't fetch CV", e);
        }
    };
    
    useEffect(()=>{
        fetchProfile();

        // fetchCv();
    },[])

    return(
    <div className="profile-container">
    {userData && (
      <div className="profile-info">
        
        <p><strong>First Name:</strong> {userData.first_name}</p>
        <p><strong>Last Name:</strong> {userData.last_name}</p>
        <p><strong>Company:</strong> {userData.company}</p>
        <p><strong>LinkedIn:</strong> {userData.linkedin ? <a href={userData.linkedin} target="_blank" rel="noopener noreferrer">{userData.linkedin}</a> : 'N/A'}</p>
        <p><strong>GitHub:</strong> {userData.github ? <a href={userData.github} target="_blank" rel="noopener noreferrer">{userData.github}</a> : 'N/A'}</p>
          <div>
            <strong>Resume:</strong> <i onClick={fetchCv}>View Resume</i>
          </div>
        {cvBlobUrl && (
        <div className="cv-container">
          <object data={cvBlobUrl} type="application/pdf" width="100%" height="500px">
            <p>Your browser does not support PDFs. <a href={cvBlobUrl}>Download the PDF</a>.</p>
          </object>
        </div>
        )}
      </div>
    )}
    </div>
    )
}

export default Profile;
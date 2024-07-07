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
            const response = await axios.get(`http://localhost:5000/actions/profile/${userId}`, {
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
          const response = await axios.get(`http://localhost:5000/actions/cv/${userId}`, {
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
    <>
    {userData && (
      <div className="profile-container">
        <div className="profile-header">
            <span>Profile</span>
        </div>
        <span className='edit-profile'>
            <button>Edit Profile</button>
          </span>
        <div className="profile-details_root">
          
          <div className='profile-details'>
            <div className="detail-item">
                <span className="label">Name:</span>
                <span className="value">{userData.first_name}</span>
            </div>
            <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">sushrut1058@gmail.com</span>
            </div>
            <div className="detail-item">
                <span className="label">Company:</span>
                <span className="value">{userData.company}</span>
            </div>
            <div className="detail-item">
                <span className="label">LinkedIn:</span>
                <span className="value">{userData.linkedin ? <a href={userData.linkedin} target="_blank" rel="noopener noreferrer">Profile Link</a>: 'N/A'}</span>
            </div>
            <div className="detail-item">
                <span className="label">Github:</span>
                <span className="value">{userData.github ? <a href={userData.github} target="_blank" rel="noopener noreferrer">Github Link</a> : 'N/A'}</span>
            </div>
            <div className="detail-item">
                <span className="label">CV:</span>
                <span className="value"><a href="/" target="_blank" rel="noopener noreferrer">CV Link</a></span>
            </div>
            {cvBlobUrl && (
            <div className="cv-container">
              <object data={cvBlobUrl} type="application/pdf" width="100%" height="500px">
                <p>Your browser does not support PDFs. <a href={cvBlobUrl}>Download the PDF</a>.</p>
              </object>
            </div>
            )}
          </div>
          <span className='display-picture'></span>
        </div>
        
      </div>
    )}
    </>
    )
}

export default Profile;
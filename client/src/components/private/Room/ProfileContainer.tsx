import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/ProfileContainer.css';

interface profileInfo {
    first_name: string;
    last_name: string;
    company: string;
    linkedin: string;
    github: string;
}

interface props {
    userId: string | undefined;
}
const ProfileContainer: React.FC<props> = ({userId}) => {
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
    
    useEffect(()=>{
        fetchProfile();

        // fetchCv();
    },[])

    return(
    <>
    {userData && (
      <div className="waiting-profile-container">
        <div className="waiting-profile-header">
            <span>Participant Profile</span>
        </div>
        <div className='waiting-profile-details'>
        <div className="waiting-detail-item">
            <span className="label">Name:</span>
            <span className="value">{userData.first_name+' '+userData.last_name}</span>
        </div>
        <div className="waiting-detail-item">
            <span className="label">Company:</span>
            <span className="value">{userData.company}</span>
        </div>
        <div className="waiting-detail-item">
            <span className="label">LinkedIn:</span>
            <span className="value">{userData.linkedin ? <a href={userData.linkedin} target="_blank" rel="noopener noreferrer">Profile Link</a>: 'N/A'}</span>
        </div>
        <div className="waiting-detail-item">
            <span className="label">Github:</span>
            <span className="value">{userData.github ? <a href={userData.github} target="_blank" rel="noopener noreferrer">Github Link</a> : 'N/A'}</span>
        </div>
        <div className="waiting-detail-item">
            <span className="label">CV:</span>
            <span className="value"><a href="/cv" target="_blank" rel="noopener noreferrer">CV Link</a></span>
        </div>
        </div>
        
      </div>
    )}
    </>
    )
}

export default ProfileContainer;
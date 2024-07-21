import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import logOutIcon from "../../static/logout.png"
import "./css/Settings.css"

interface User{
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  linkedin: string | null;
  github: string | null;
  email: string | null;
  cv: File | null;
  companyLinkedin: string | null;
}

const Settings = () => {

  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
  const [userData, setUserData] = useState<User>({
    first_name: '',
    last_name: '',
    email:'',
    company: '',
    linkedin: '',
    github: '',
    cv: null,
    companyLinkedin: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name==='cv' && files){
      setUserData((prevData) => ({ ...prevData, [name]: files[0] }));
    }else{
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  const handleSubmit = () => {
    
  }

  if(isLoading) return(<>Loading</>);

  return (
    <div className="settings-container">
      <div className="settings-header">
          <span>Update Details</span>
      </div>
      <form onSubmit={handleSubmit} className="settings-form">
      <div className="form-group">
        <input
            type="text"
            id="first-name"
            value={userData.first_name || ''}
            onChange={handleInputChange}
            placeholder="First Name"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="last-name"
            value={userData.last_name || ''}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="email"
            value={userData.email || ''}
            onChange={handleInputChange}
            placeholder="Email"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="company"
            value={userData.company || ''}
            onChange={handleInputChange}
            placeholder="Company"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="linkedin"
            value={userData.linkedin || ''}
            onChange={handleInputChange}
            placeholder="LinkedIn"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="company"
            value={userData.github || ''}
            onChange={handleInputChange}
            placeholder="Github"
            className="form-input"
        />
      </div>
      <div className="form-group">
      <label htmlFor="cv" className="cv-label">Upload CV</label>
        <input
            type="file"
            id="cv"
            onChange={handleInputChange}
            className="cv-input"
            accept=".pdf"
            name="cv"
        />
      </div>
      <button className="create-room-btn" name="submit" onClick={handleSubmit}>Update</button>
      </form>
    </div>

  );
};

export default Settings;
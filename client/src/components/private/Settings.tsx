import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import logOutIcon from "../../static/logout.png"
import "./css/Settings.css"

interface User{
  first_name: string;
  last_name: string;
  company: string;
  linkedin: string;
  github: string;
  email: string;
  // cv: File | null;
  companyLinkedin: string;
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
    // cv: null,
    companyLinkedin: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    console.log(userData, name, value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem('access');
      console.log(token);
      const response = await axios.post("http://localhost:5000/update", {
        ...userData
      }, {
        headers:{
          "Authorization":`Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if(response.status===404 || response.status===500){
        console.log(response.data.message, response.data);
      }else{
        console.log("Successfully updated profile: ",response.data);
      }
    }catch(e){
      console.log(e);
    }
    
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
            id="first_name"
            value={userData.first_name}
            name="first_name"
            onChange={handleInputChange}
            placeholder="First Name"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="last_name"
            value={userData.last_name}
            name="last_name"
            onChange={handleInputChange}
            placeholder="Last Name"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="company"
            name="company"
            value={userData.company}
            onChange={handleInputChange}
            placeholder="Company"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="linkedin"
            name="linkedin"
            onChange={handleInputChange}
            value={userData.linkedin}
            placeholder="LinkedIn"
            className="form-input"
        />
      </div>
      <div className="form-group">
        <input
            type="text"
            id="github"
            name="github"
            value={userData.github}
            onChange={handleInputChange}
            placeholder="Github"
            className="form-input"
        />
      </div>
      <button className="create-room-btn" name="submit" onClick={handleSubmit}>Update</button>
      </form>
    </div>

  );
};

export default Settings;
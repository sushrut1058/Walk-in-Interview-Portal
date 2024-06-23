import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import './css/Onboard.css';

interface User{
  company: string | null;
  linkedin: string | null;
  github: string | null;
  cv: File | null;
  role: string | null;
  companyLinkedin: string | null;
}

const Onboard: React.FC = () => {
  
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
  const [userData, setUserData] = useState<User>({
    company: null,
    linkedin: null,
    github: null,
    cv: null,
    role: null,
    companyLinkedin: null
  });

  if (isLoading){
    return <div>Loading...</div>
  }

  const onboardUser = async (event : React.FormEvent) => {
    event.preventDefault();

    try{
        const token = localStorage.getItem('access');
        const formData = new FormData();

        formData.append('role', userData.role || '');
        formData.append('company', userData.company || '');
        formData.append('linkedin', userData.linkedin || '');
        formData.append('github', userData.github || '');
        formData.append('cv', userData.cv as Blob);
        console.log(formData);
        const response = await fetch('http://localhost:8000/acc/onboard',{
            method: "POST",
            headers:{
              Authorization : `Bearer ${token}`
            },
            body: formData
        })

        if(response.ok){
            alert("User Onboarded successfully");
            const data = await response.json();
            localStorage.setItem('access', data.token);
            validateToken();
        }else{
            const data = await response.json();
            console.log(data.message);
        }
    }catch(error) {
        console.log("Something wrong with resending email:", error)
    }

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name==='cv' && files){
      setUserData((prevData) => ({ ...prevData, [name]: files[0] }));
    }else{
      console.log(userData.role)
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  console.log()
  return (
    <div>
      <h1>Onboarding Page, Hello: {user.first_name}</h1>
      <form>
      <div className="radio-group">
        Role:
        <label>
        <input
          type="radio"
          name="role"
          value="Hire"
          checked={userData.role === 'Hire'}
          onChange={handleInputChange}
        />
        Hire
        </label>
        <label>
        <input
          type="radio"
          name="role"
          value="Hunt"
          checked={userData.role === 'Hunt'}
          onChange={handleInputChange}
        />
        Hunt
        </label>
      </div>
      <br/>
      <input type="text" onChange={handleInputChange} value={user.company} name="company" placeholder="Company"/>
      <input type="text" onChange={handleInputChange} value={user.linkedin} name="linkedin" placeholder="LinkedIn Profile"/>
      <input type="text" onChange={handleInputChange} value={user.github} name="github" placeholder="Github"/>
      <label>
        Upload Resume:
        <input type="file" onChange={handleInputChange} accept=".pdf" name="cv"/>
      </label>
      <button name="submit" onClick={onboardUser}>Finish!</button>
    </form>
      
    </div>
  );
};

export default Onboard;

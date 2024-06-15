import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

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
  const [role, setRole] = useState<string>('');
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

    if(!role){
        alert("Please select a role!");
        return;
    }

    try{
        const token = localStorage.getItem('access');
        
        const response = await fetch('http://localhost:8000/acc/onboard',{
            method: "POST",
            headers:{
              "Content-Type":"application/json",
              Authorization : `Bearer ${token}`
            },
            body:JSON.stringify({role})
        })

        if(response.ok){
            alert("User Onboarded successfully");
            const data = await response.json();
            // const updatedUser = {...user, is_onboarded:true, role:{role}};
            // updateUser(updatedUser);
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
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  }

  console.log()
  return (
    <div>
      <h1>Onboarding Page, Hello: {user.first_name}</h1>
      <form>
      <label>
        <input
          type="radio"
          value="Hire"
          checked={userData.role === 'Hire'}
          onChange={handleInputChange}
        />
        Hire
      </label>
      <label>
        <input
          type="radio"
          value="Hunt"
          checked={userData.role === 'Hunt'}
          onChange={handleInputChange}
        />
        Hunt
      </label><br/>
      <input type="text" onChange={handleInputChange} value={user.company} name="company"/>
      <input type="text" onChange={handleInputChange} value={user.linkedin} name="linkedin"/>
      <input type="text" onChange={handleInputChange} value={user.github} name="github"/>

      <button name="submit" onClick={onboardUser}>Finish!</button>
    </form>
      
    </div>
  );
};

export default Onboard;

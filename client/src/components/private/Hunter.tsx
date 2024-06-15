import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Hunter: React.FC = () => {
  
  const { isAuthenticated, user, isLoading, logOut, updateUser, validateToken } = useAuth(); // Destructure to get isAuthenticated
  const [role, setRole] = useState<string>('');

  if (isLoading){
    return <div>Loading...</div>
  }

  const handleSubmit = async (event : React.FormEvent) => {
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
            validateToken();
        }else{
            const data = await response.json();
            console.log(data.message);
        }
    }catch(error) {
        console.log("Something wrong with resending email:", error)
    }

  }

  console.log()
  return (
    <div>
        <h1>Hunter Page</h1>
    </div>
  );
};

export default Hunter;

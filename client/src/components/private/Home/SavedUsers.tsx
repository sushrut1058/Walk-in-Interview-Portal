import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/SavedUsers.css';

interface User{
  roomId: string,
  userId: string
}

const SavedUsers: React.FC = () => {
  
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const getUsers = async () => {
    try{
      const token = localStorage.getItem('access');
      const response = await axios.get("http://localhost:5000/actions/saved-users",{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      setUsers(response.data);
    }catch (e) {
      console.log("Can't load history", e);
    }
  }

  useEffect(()=>{getUsers();},[]);
  console.log(users);
  return(
    <div className="history-container">
      <div className="history-header">
          <span>History</span>
      </div>
      <div className="refresh">
        <button onClick={getUsers}>Refresh</button> 
      </div>
      <table className="history-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Room uid</th>
                <th>Profile</th>
            </tr>
        </thead>
        <tbody>
        {users?.map((user:User, index: number) => (
          <tr>
            <td>{index+1}</td>
            <td>{user.roomId}</td>
            <td><a href={`/view-profile/${user.userId}`} target="_blank">Profile Link</a></td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedUsers;
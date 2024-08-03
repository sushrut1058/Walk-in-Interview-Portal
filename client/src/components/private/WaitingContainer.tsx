import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './css/WaitingContainer.css';
import Waiting from "./Waiting";

const sock_url = "http://localhost:5000";

interface props{
  roomId: string | undefined;
}

interface User{
    id: string,
    first_name: string
}


const WaitingContainer: React.FC<props> = ({roomId}: props) => {
  
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();
  

//   useEffect(()=>{checkActiveRooms()},[]);

  return(
    <div className="WaitingContainer-container">
        <Waiting roomId={roomId} updateUser_callback={setUsers}/>
      <div className="WaitingContainer-header">
          <span>Waiting Arena</span>
      </div>
      <div className="refresh">
      </div>
      <table className="WaitingContainer-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Participant</th>
            </tr>
        </thead>
        <tbody>
        {users?.map((user:User, index: number) => (
          <tr>
            <td>{index+1}</td>
            <td>{user.first_name}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default WaitingContainer;

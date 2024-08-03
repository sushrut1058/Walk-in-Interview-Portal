import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/WaitingContainer.css';
import Waiting from "./Waiting";

const sock_url = "http://localhost:5000";

interface props{
  roomId: string | undefined;
}

interface User{
    id: string,
    first_name: string
}


const WaitingBox: React.FC<props> = ({roomId}: props) => {
  
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [sendInvite, setSendInvite] = useState<((userId: string) => void) | null>(null);

  const navigate = useNavigate();

  const sendInvitation = (userId: string) => {
    if(sendInvite) sendInvite(userId);
  }
  
  return(
    <div className="WaitingContainer-container">
        <Waiting roomId={roomId} updateUser_callback={setUsers} setSendInvite={setSendInvite}/>
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
                <th>Profile</th>
                <th> </th>
            </tr>
        </thead>
        <tbody>
        {users?.map((user:User, index: number) => (
          user.id!=auth.user.id ?
          <tr>
            <td>{index+1}</td>
            <td>{user.first_name}</td>
            <td><a href={`/view-profile/${user.id}`} target="_blank" rel="noopener noreferrer">Profile Link</a></td>
            <td><button className="invite" onClick={() => sendInvitation(user.id)}>Summon!</button></td>
          </tr>
          :
          <></>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default WaitingBox;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import io, { Socket } from "socket.io-client";
import './css/Waiting.css';
import Profile from './Profile';

interface User{
  id: string,
  first_name: string
}

interface WaitingProps{
  roomId: string | undefined
}

const sock_url = "http://localhost:5000";

const Waiting: React.FC<WaitingProps> = ({roomId}) => {
  const [users, setUsers] = useState<User[]>([]);
  const socket = useRef<Socket | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const sendInvite = (userId: string | any) => {
    console.log("trigg", socket);
    if(socket.current){
      socket.current.emit("invite", userId);
    }else{
      console.log("Null socket");
    }
  }

  const showProfile = (userId: string) => {
    setSelectedUser(null);
    setSelectedUser(userId);
  }

  const closeProfile = () => {
    setSelectedUser(null);
  }

  useEffect(()=>{  
    if (socket.current) {
      socket.current.disconnect();
    }
    const onInvitation = (msg: any) => {
      if(socket.current){
        socket.current?.disconnect();
      }
      navigate(`/room/${roomId}`);
    }
    const updateUsers = (activeUsers: User[]) => {
      setUsers(activeUsers);
    }
    try{
        const token = localStorage.getItem('access');
        let namespace = "waiting-arena";
        socket.current = io(`${sock_url}/${namespace}`,{
            query:{token}
        });
        socket.current.on("updateUsers", updateUsers);
        socket.current.on("invitation", onInvitation);
        socket.current.emit("joinRoom", roomId);
        socket.current.on("error", (msg)=>console.log(msg));
    } catch (e){
        console.log("[Socket] Couldn't establish connection with the server", e);
    }
  },[]);

  return (
      <div className='waitingContainer'>
        <ul>
          {users.map(user=>(
            <li key={user.id}>
              <span className="title">
                {user.id} : {user.first_name}
              </span>
              {auth.user.role==2 && (
                <span className='btns'> 
                  <button onClick={()=>sendInvite(user.id)}>Invite</button> 
                  <button onClick={()=>setSelectedUser(user.id)}>Profile</button>
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className='ProfileComp'>
        {selectedUser && 
          <div>
            <button onClick={closeProfile}>Back</button>
            <Profile userId={selectedUser}/>
          </div>}
        </div>
      </div>
  );
};

export default Waiting;

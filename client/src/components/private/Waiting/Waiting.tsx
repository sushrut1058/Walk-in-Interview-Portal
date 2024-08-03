import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import io, { Socket } from "socket.io-client";
import '../css/Waiting.css';
import Profile from '../Home/Profile';

interface User{
  id: string,
  first_name: string
}

interface WaitingProps{
  roomId: string | undefined ;
  updateUser_callback: (users: User[]) => void;
  setSendInvite?: (sendInvite: (userId: string) => void) => void; // Function to set sendInvite in parent
  // showProfile_callback: (userId: string) => void; 
}

const sock_url = "http://localhost:5000";

const Waiting: React.FC<WaitingProps> = ({roomId, updateUser_callback, setSendInvite}) => {
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

  useEffect (()=>{
      if(setSendInvite) {
        setSendInvite(()=>sendInvite);
        console.log("SendInvite was set");
      }
  }, [socket.current]);

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
      updateUser_callback(activeUsers);
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

  return null;
};

export default Waiting;

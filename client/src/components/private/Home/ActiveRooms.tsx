import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Room{
  roomId: string,
  title: string,
  duration: string
}

const ActiveRooms: React.FC = () => {
  
  const auth = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const checkActiveRooms = async () => {
    try{
      const token = localStorage.getItem('access');
      const response = await axios.get("http://localhost:8000/actions/active-rooms",{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      setRooms(response.data);
    }catch (e) {
      console.log("Can't load active rooms", e);
    }
  }

  useEffect(()=>{checkActiveRooms()},[]);

   return (
    <div>
      <h3>Available Rooms</h3>
      <button onClick={checkActiveRooms}>Refresh!</button>
      <ul>
        {rooms?.map((room:Room) => (
          <li key={room.roomId} onClick={()=>navigate(`/waiting/${room.roomId}`)}>
            {room.title} - Duration:&nbsp; {room.duration}
          </li>
        ))}
      </ul>
     
    </div>
  );
};

export default ActiveRooms;
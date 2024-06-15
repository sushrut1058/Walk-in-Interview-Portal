import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Room{
    title: string;
    company: string;
    roomId: string;
}

const RoomHistory: React.FC = () => {

  const [rooms,setRooms] = useState<Room[]>([]);
  const auth = useAuth();
  useEffect(()=>{
    const fetchRooms = async () => {
        try{
            const token = await localStorage.getItem('token');
            const resp = await axios.get("http://localhost:8000/actions/history", {
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            });
            if(!resp){
                console.log("Something went wrong");
            }else{
                setRooms(resp.data);
            }
        }catch(e){
            console.log("Can't load rooms");
        }
    }
    fetchRooms();
  },[]);

   return (
    <div>
      <h3>History</h3>
      {
        rooms && rooms.length>0 ? 
        (
        <ul>
            {rooms?.map((room: Room) => (
            <li key={room.roomId}>
                {room.title} - Company:&nbsp {room.company}
            </li>
            ))}
        </ul>
        ): 
        (
            <div><h5>No rooms to show</h5></div>
        )
    }
     
    </div>
  );
};

export default RoomHistory;
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/ActiveRooms.css';

interface Room{
  roomId: string,
  title: string,
  duration: string,
  createdAt: string,
  linkedin: string
}

const ActiveRooms: React.FC = () => {
  
  const auth = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const checkActiveRooms = async () => {
    try{
      const token = localStorage.getItem('access');
      const response = await axios.get("http://localhost:5000/actions/active-rooms",{
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

  return(
    <div className="active-rooms-container">
      <div className="active-rooms-header">
          <span>Active Rooms</span>
      </div>
      <div className="refresh">
        <button onClick={checkActiveRooms}>Refresh</button>
      </div>
      <table className="rooms-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Duration (hrs)</th>
                <th>Created on</th>
                <th>Created By</th>
            </tr>
        </thead>
        <tbody>
        {rooms?.map((room:Room, index: number) => (
          <tr onClick={()=>navigate(`/waiting/${room.roomId}`)}>
            <td>{index+1}</td>
            <td>{room.title}</td>
            <td>{room.duration}</td>
            <td>{room.createdAt}</td>
            <td><a href={room.linkedin} target="_blank">Profile Link</a></td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveRooms;
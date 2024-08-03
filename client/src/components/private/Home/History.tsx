import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/History.css';

interface Room{
  roomId: string,
  title: string,
  duration: string,
  createdAt: string,
  linkedin: string
}

const History: React.FC = () => {
  
  const auth = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const getHistory = async () => {
    try{
      const token = localStorage.getItem('access');
      const response = await axios.get("http://localhost:5000/actions/history",{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      setRooms(response.data);
    }catch (e) {
      console.log("Can't load history", e);
    }
  }

  useEffect(()=>{getHistory();},[]);

  return(
    <div className="history-container">
      <div className="history-header">
          <span>History</span>
      </div>
      <div className="refresh">
        <button onClick={getHistory}>Refresh</button>
      </div>
      <table className="history-table">
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
          <tr>
            <td>{index+1}</td>
            <td>{room.title}</td>
            <td>{room.duration}</td>
            <td>{room.createdAt}</td>
            <td><a href={room.linkedin}>Profile Link</a></td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
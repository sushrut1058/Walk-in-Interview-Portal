import React, {useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../css/CreateRoom.css';

const CreateRoom: React.FC = () => {
  
  const auth = useAuth();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('#');
  const navigate = useNavigate();
  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent the form from submitting traditionally
    console.log('Submitted with name:', title, 'and duration:', duration);
    
    try{
        const token = await localStorage.getItem('access');

        const response = await axios.post("http://localhost:5000/actions/create-room",{
            title: title,
            duration: duration
        },{
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }
        }) 
        console.log(response.data);
        navigate(`/room_${response.data.roomId}`);
    } catch (e) {
        console.log("Something went wrong!",e);
    }
};

    return (
        <div className="create-room-container">
            <div className="create-room-header">
                <span>Create Room</span>
            </div>
            <form onSubmit={handleSubmit} className="create-room-form">
            <div className="form-group">
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Room Title"
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="custom-dropdown"
                >
                    <option value="#" >Duration</option>
                    <option value="0.5">30 minutes</option>
                    <option value="0.75">45 minutes</option>
                    <option value="1">1 hour</option>
                </select>
            </div>
            <button className="create-room-btn" type="submit">Create Room</button>
            </form>
        </div>
    );
};

export default CreateRoom;

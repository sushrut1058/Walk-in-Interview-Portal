import React, {useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const CreateRoom: React.FC = () => {
  
  const auth = useAuth();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30min');
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
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Room Title"
                />
            </div>
            <div>
                <label htmlFor="duration">Duration: &nbsp;</label>
                <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="custom-dropdown"
                >
                    <option value="30min">30min</option>
                    <option value="60min">60min</option>
                </select>
            </div><br/>
            <button className="create-room" type="submit">Create Room</button>
        </form>
    );
};

export default CreateRoom;

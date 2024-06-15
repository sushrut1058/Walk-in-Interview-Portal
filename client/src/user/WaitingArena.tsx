import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import io, { Socket } from "socket.io-client";
import Waiting from '../components/private/Waiting';

interface User{
  id: string,
  first_name: string
}

const sock_url = "http://localhost:8000";

const WaitingArena: React.FC = () => {
  const {roomId} = useParams();
  return (

    <div>
      <h1>Waiting Arena for Room Id: {roomId}</h1>
      <h3>Active Users</h3>
      <Waiting roomId={roomId} />
    </div>
  );
};

export default WaitingArena;

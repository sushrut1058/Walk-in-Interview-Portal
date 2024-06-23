import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import io, { Socket } from "socket.io-client";
import Waiting from '../components/private/Waiting';
import Header from '../components/private/Header';

interface User{
  id: string,
  first_name: string
}


const WaitingArena: React.FC = () => {
  const {roomId} = useParams();
  return (
    <div>
      <Header/>
      <div>
      <h1>Waiting Arena for Room Id: {roomId}</h1>
      <h3>Active Users</h3>
      <Waiting roomId={roomId} />
      </div>
    </div>
  );
};

export default WaitingArena;

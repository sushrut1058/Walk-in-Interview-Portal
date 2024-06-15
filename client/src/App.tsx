import React from 'react';
import './App.css';
import Landing from './public/Landing';
import HomePage from './user/HomePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './contexts/ProtectedRoute';
import PublicRoute from './contexts/PublicRoute';
import Room from './user/Room';
import WaitingArena from './user/WaitingArena';
import { SocketProvider } from './contexts/SocketContext';

const SocketLayout: React.FC = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}

const App : React.FC = () => {

  return (
    
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/home" element={<ProtectedRoute component={HomePage} />} />  
          <Route path="/" element={<PublicRoute component={Landing} />} />
          <Route path="/room/:roomId" element={<ProtectedRoute component={Room} />} />
          <Route path="/waiting/:roomId" element={<ProtectedRoute component={WaitingArena} />} />
        </Routes> 
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
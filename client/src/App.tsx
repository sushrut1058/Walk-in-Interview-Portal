import React from 'react';
import './App.css';
import Landing from './public/Landing';
import HomePage from './user/HomePage';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import PublicRoute from './auth/PublicRoute';
import Room from './user/Room';
import WaitingArena from './user/WaitingArena';
import CVviewer from './components/private/Miscellaneous/CVviewer';
import ProfileView from './user/ProfileView';

const App : React.FC = () => {

  return (
    
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/home" element={<ProtectedRoute component={HomePage} />} />  
          <Route path="/" element={<PublicRoute component={Landing} />} />
          <Route path="/room/:roomId" element={<ProtectedRoute component={Room} />} />
          <Route path="/waiting/:roomId" element={<ProtectedRoute component={WaitingArena} />} />
          <Route path="/cv" element={<ProtectedRoute component={CVviewer}/>} />
          <Route path="/view-profile/:pid" element={<ProtectedRoute component={ProfileView} />} />
        </Routes> 
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
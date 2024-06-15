import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any; 
  validateToken: () => Promise<void>;
  logIn: (user: any) => void;
  logOut: () => void;
  updateUser : (User: any) => void;
}

interface Props {
    children: ReactNode;  // This type accepts any valid React child, including null, string, number, and JSX
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const updateUser = (User : any) => {
    setUser(User);
  }

  const navigate = useNavigate(); 

  const validateToken = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('access');
    try {
        const response = await fetch('http://localhost:8000/acc/validate_token/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ token }),
        });
        if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data);
        } else {
            const data = await response.json();
            setIsAuthenticated(false);
            setUser(null);
        }
    } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        console.error("Failed to fetch");
    } 
    setIsLoading(false);
    console.log("Ran validateToken")
  };

  const logIn = (user: any) => {
    setIsAuthenticated(true);
    setUser(user);
    navigate("/home");
  }

  const logOut = () => {
    // setUser(null);
    // setIsAuthenticated(false);
    localStorage.removeItem("access");
    window.location.href = '/';
  }

  useEffect(()=>{
        validateToken();
    },[])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, validateToken, updateUser, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    // console.log("start");
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error ('useAuth must be used within an AuthProvider')
    }  
    return context;
};
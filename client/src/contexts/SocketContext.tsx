import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

// Define the type for the context state
interface SocketContextType {
  socket: Socket | null;
  connectSocket: (namespace: string, events?: Array<{name: string, handler: (res: any) => void}>) => void;
  disconnectSocket: () => void;
}

// Create the context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Define the provider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // Function to connect to a socket namespace
  const connectSocket = (namespace: string, events?: Array<{name: string, handler: (res: any) => void}>) => {
    if (socket) {
      socket.disconnect();
    }
    const token = localStorage.getItem('access');
    // Assuming your server is on localhost:5000
    try{
        const newSocket = io(`http://localhost:5000/${namespace}`,{
            query:{token}
        });
        setSocket(newSocket);

        events?.forEach(({name,handler}) => {
            newSocket.on(name, handler);
        });
    } catch (e){
        console.log("[Socket] Couldn't establish connection with the server", e);
    }
  };

  // Function to disconnect the current socket
  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
  };

  // Provide cleanup on component unmount
  useEffect(() => {
    disconnectSocket();
  }, []);

  useEffect(()=>{},[socket]);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

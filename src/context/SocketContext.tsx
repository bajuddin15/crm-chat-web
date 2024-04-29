import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client"; // Import Socket type
import { SOCKET_URL } from "../constants";

interface SocketContextType {
  socket: any; // Adjust the type
  onlineUsers: any[]; // Change `any` to the type of your user object
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

interface SocketContextProviderProps {
  children: React.ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<any>(null); // Adjust the type
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const connectSocket = () => {
      const newSocket = io(SOCKET_URL, {
        query: {
          userId: authUser?._id, // Use optional chaining to avoid errors if authUser is null or undefined
        },
      });

      setSocket(newSocket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      newSocket.on("getOnlineUsers", (users: any[]) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    };

    if (authUser) {
      connectSocket();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]); // Include socket in the dependency array

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

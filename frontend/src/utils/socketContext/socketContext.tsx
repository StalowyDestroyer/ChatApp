import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
  emitEvent: (event: string, data?: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent: (event: string, callback: (data: any) => void) => void;
}

export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined
);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const emitEvent = (event: string, data?: unknown) => {
    socket?.emit(event, data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEvent = (event: string, callback: (data: any) => void) => {
    socket?.on(event, callback);

    return () => {
      socket?.off(event, callback);
    };
  };

  return (
    <SocketContext.Provider value={{ socket, emitEvent, onEvent }}>
      {children}
    </SocketContext.Provider>
  );
};

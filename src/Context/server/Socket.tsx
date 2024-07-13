import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    const context = useContext(socketContext);
    if (context === null) {
        throw new Error("useSocket deve ser usado dentro de um SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const socket = io('http://localhost:8080');

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
};
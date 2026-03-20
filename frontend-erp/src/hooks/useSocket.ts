"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

let globalSocket: Socket | null = null;

function getSocket(): Socket {
    if (!globalSocket) {
        globalSocket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10,
        });
    }
    return globalSocket;
}

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = getSocket();

        if (!socketRef.current.connected) {
            socketRef.current.connect();
        }

        return () => {
            // Don't disconnect — keep the singleton alive
        };
    }, []);

    const on = useCallback((event: string, handler: (...args: any[]) => void) => {
        const socket = socketRef.current || getSocket();
        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, []);

    const emit = useCallback((event: string, data?: any) => {
        const socket = socketRef.current || getSocket();
        socket.emit(event, data);
    }, []);

    return { socket: socketRef.current, on, emit };
}

import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function connectSocket() {
  if (typeof window === 'undefined') return null;
  if (socket?.connected) return socket;

  const token = localStorage.getItem('accessToken');

  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(BACKEND_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    auth: {
      token,
    },
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}

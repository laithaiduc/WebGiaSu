import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { authenticateFromCookieHeader } from './utils/auth';

let io: Server | null = null;

export function initRealtime(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    const user = await authenticateFromCookieHeader(cookieHeader);
    if (!user) {
      return next(new Error('Unauthorized'));
    }
    socket.data.user = user;
    return next();
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    if (!user?.id) {
      socket.disconnect();
      return;
    }

    socket.join(`user:${user.id}`);

    socket.on('disconnect', () => {
      socket.leave(`user:${user.id}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function emitNewMessage(message: {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: number | boolean;
  created_at: string;
}) {
  if (!io) return;
  io.to(`user:${message.sender_id}`).emit('message:new', message);
  io.to(`user:${message.receiver_id}`).emit('message:new', message);
}

export function emitUnreadCount(userId: number, count: number) {
  if (!io) return;
  io.to(`user:${userId}`).emit('unread:update', { count });
}

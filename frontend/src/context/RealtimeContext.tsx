"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { fetchUnreadCount } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export type RealtimeMessage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: number | boolean;
  created_at: string;
};

type RealtimeContextValue = {
  unreadCount: number;
  refreshUnread: () => Promise<void>;
  subscribeMessage: (handler: (message: RealtimeMessage) => void) => () => void;
  connected: boolean;
};

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef(new Set<(message: RealtimeMessage) => void>());

  const refreshUnread = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetchUnreadCount();
      setUnreadCount(res.count ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, [user]);

  const subscribeMessage = useCallback((handler: (message: RealtimeMessage) => void) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setConnected(false);
      setUnreadCount(0);
      return;
    }

    refreshUnread();
    const socket = connectSocket();
    if (!socket) return;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (message: RealtimeMessage) => {
      handlersRef.current.forEach((handler) => handler(message));
      if (message.receiver_id === user.id) {
        setUnreadCount((c) => c + (message.is_read ? 0 : 1));
      }
    };
    const onUnread = (payload: { count: number }) => {
      setUnreadCount(payload.count ?? 0);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:new', onMessage);
    socket.on('unread:update', onUnread);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:new', onMessage);
      socket.off('unread:update', onUnread);
      disconnectSocket();
      setConnected(false);
    };
  }, [user, refreshUnread]);

  const value = useMemo(
    () => ({ unreadCount, refreshUnread, subscribeMessage, connected }),
    [unreadCount, refreshUnread, subscribeMessage, connected]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error('useRealtime must be used within RealtimeProvider');
  return ctx;
}

"use client";



import { useEffect, useState, Suspense, useRef, useCallback } from 'react';

import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

import { Send, MessageCircle, User, Wifi, WifiOff, ChevronLeft } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

import { useRealtime } from '@/context/RealtimeContext';

import {

  fetchMessageThreads,

  fetchConversation,

  sendMessage,

  markMessagesRead,

  fetchUserById,

} from '@/lib/api';

import './messages.css';



type Thread = {

  partner_id: number;

  partner_name: string;

  partner_avatar: string;

  partner_role: string;

  last_message: string;

  last_at: string;

  unread: boolean;

  is_outgoing: boolean;

};



type ChatMessage = {

  id: number;

  sender_id: number;

  receiver_id: number;

  content: string;

  created_at: string;

};



function MessagesInboxContent({ profileBasePath }: { profileBasePath: 'tutors' | 'students' }) {

  const { user } = useAuth();

  const { subscribeMessage, refreshUnread, connected } = useRealtime();

  const searchParams = useSearchParams();

  const initialPartnerId = Number(searchParams.get('with') || 0);



  const [threads, setThreads] = useState<Thread[]>([]);

  const [selectedId, setSelectedId] = useState<number | null>(initialPartnerId || null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [inputValue, setInputValue] = useState('');

  const [loadingThreads, setLoadingThreads] = useState(true);

  const [loadingChat, setLoadingChat] = useState(false);

  const [sending, setSending] = useState(false);

  const [partnerName, setPartnerName] = useState('');

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const selectedIdRef = useRef<number | null>(selectedId);



  useEffect(() => {

    selectedIdRef.current = selectedId;

  }, [selectedId]);



  const scrollToBottom = useCallback(() => {

    const el = chatBodyRef.current;

    if (el) el.scrollTop = el.scrollHeight;

  }, []);



  const loadThreads = useCallback(async (silent = false) => {

    if (!silent) setLoadingThreads(true);

    try {

      const res = await fetchMessageThreads();

      setThreads(res.data || []);

    } catch {

      if (!silent) setThreads([]);

    } finally {

      if (!silent) setLoadingThreads(false);

    }

  }, []);



  const loadConversation = useCallback(async (otherId: number, silent = false) => {

    if (!silent) setLoadingChat(true);

    try {

      const res = await fetchConversation(otherId);

      setMessages(res.data || []);

      await markMessagesRead(otherId);

      await refreshUnread();

      setThreads((current) =>

        current.map((t) => (t.partner_id === otherId ? { ...t, unread: false } : t))

      );

      if (!silent) setTimeout(scrollToBottom, 50);

    } catch {

      if (!silent) setMessages([]);

    } finally {

      if (!silent) setLoadingChat(false);

    }

  }, [refreshUnread, scrollToBottom]);



  const partnerIdForMessage = useCallback((msg: ChatMessage, myId: number) => {

    return msg.sender_id === myId ? msg.receiver_id : msg.sender_id;

  }, []);



  useEffect(() => {

    if (!user) return;

    loadThreads();

  }, [user, loadThreads]);



  useEffect(() => {

    if (!initialPartnerId || !user) return;



    const ensurePartner = async () => {

      try {

        const res = await fetchUserById(initialPartnerId);

        const partner = res.data;

        if (!partner) return;

        setPartnerName(partner.name);

        setSelectedId(initialPartnerId);

        setThreads((current) => {

          if (current.some((t) => t.partner_id === initialPartnerId)) return current;

          return [

            {

              partner_id: initialPartnerId,

              partner_name: partner.name,

              partner_avatar: partner.avatar || '',

              partner_role: partner.role,

              last_message: '',

              last_at: new Date().toISOString(),

              unread: false,

              is_outgoing: true,

            },

            ...current,

          ];

        });

      } catch {

        // ignore

      }

    };



    ensurePartner();

  }, [initialPartnerId, user]);



  useEffect(() => {

    if (!selectedId) {

      setMessages([]);

      return;

    }

    loadConversation(selectedId);

  }, [selectedId, loadConversation]);



  useEffect(() => {

    if (!user) return;



    return subscribeMessage((incoming) => {

      const partnerId = partnerIdForMessage(incoming, user.id);

      const activeId = selectedIdRef.current;



      setThreads((current) => {

        const existing = current.find((t) => t.partner_id === partnerId);

        const updated: Thread = {

          partner_id: partnerId,

          partner_name: existing?.partner_name || 'Người dùng',

          partner_avatar: existing?.partner_avatar || '',

          partner_role: existing?.partner_role || '',

          last_message: incoming.content,

          last_at: incoming.created_at,

          unread: incoming.receiver_id === user.id && activeId !== partnerId,

          is_outgoing: incoming.sender_id === user.id,

        };

        const rest = current.filter((t) => t.partner_id !== partnerId);

        return [updated, ...rest];

      });



      if (activeId === partnerId) {

        setMessages((current) => {

          if (current.some((m) => m.id === incoming.id)) return current;

          return [...current, incoming];

        });

        if (incoming.receiver_id === user.id) {

          markMessagesRead(partnerId).then(() => refreshUnread());

        }

        setTimeout(scrollToBottom, 50);

      }

    });

  }, [user, subscribeMessage, partnerIdForMessage, refreshUnread, scrollToBottom]);



  useEffect(() => {

    scrollToBottom();

  }, [messages.length, scrollToBottom]);



  const handleSend = async () => {

    if (!inputValue.trim() || !selectedId || !user) return;

    setSending(true);

    const content = inputValue.trim();

    setInputValue('');

    const optimisticId = Date.now();

    setMessages((current) => [

      ...current,

      {

        id: optimisticId,

        sender_id: user.id,

        receiver_id: selectedId,

        content,

        created_at: new Date().toISOString(),

      },

    ]);

    setTimeout(scrollToBottom, 50);



    try {

      const res = await sendMessage({ receiver_id: selectedId, content });

      const saved = res.data;

      if (saved?.id) {

        setMessages((current) => {

          const replaced = current.map((m) => (m.id === optimisticId ? saved : m));

          // Deduplicate: keep first occurrence of each id
          const seen = new Set<number>();
          return replaced.filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });

        });

      }

      await loadThreads(true);

    } catch {

      setMessages((current) => current.filter((m) => m.id !== optimisticId));

      alert('Không thể gửi tin nhắn.');

    } finally {

      setSending(false);

    }

  };



  if (!user) {

    return (

      <div className="messages-page-wrapper">

        <p>Vui lòng <Link href="/login">đăng nhập</Link> để xem tin nhắn.</p>

      </div>

    );

  }



  const selectedThread = threads.find((t) => t.partner_id === selectedId);

  const displayName = selectedThread?.partner_name || partnerName || 'Người dùng';



  return (

    <div className="messages-page-wrapper">

      <div className="messages-page-header">

        <h1 className="messages-title">Tin nhắn của tôi</h1>

        <span className={`messages-live-badge ${connected ? 'online' : 'offline'}`} title={connected ? 'Đang kết nối real-time' : 'Mất kết nối, đang thử lại...'}>

          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}

          {connected ? 'Trực tuyến' : 'Đang kết nối...'}

        </span>

      </div>



      <div className="messages-layout">

        <aside className={`messages-sidebar ${selectedId ? 'hidden-on-mobile' : ''}`}>

          <div className="messages-sidebar-header">

            <MessageCircle size={20} />

            <span>Cuộc trò chuyện ({threads.length})</span>

          </div>



          {loadingThreads ? (

            <p className="messages-empty">Đang tải...</p>

          ) : threads.length === 0 ? (

            <p className="messages-empty">Chưa có cuộc trò chuyện nào. Hãy liên hệ gia sư từ trang hồ sơ.</p>

          ) : (

            <div className="messages-thread-list">

              {threads.map((thread) => (

                <button

                  key={thread.partner_id}

                  type="button"

                  className={`messages-thread-item ${selectedId === thread.partner_id ? 'active' : ''}`}

                  onClick={() => setSelectedId(thread.partner_id)}

                >

                  {thread.partner_avatar ? (

                    <img src={thread.partner_avatar} alt="" className="messages-avatar" />

                  ) : (

                    <div className="messages-avatar messages-avatar-fallback">

                      {thread.partner_name.charAt(0).toUpperCase()}

                    </div>

                  )}

                  <div className="messages-thread-body">

                    <div className="messages-thread-top">

                      <strong>{thread.partner_name}</strong>

                      {thread.unread && <span className="messages-badge">Mới</span>}

                    </div>

                    <p className="messages-preview">

                      {thread.is_outgoing ? 'Bạn: ' : ''}{thread.last_message || 'Bắt đầu trò chuyện...'}

                    </p>

                    <span className="messages-time">

                      {thread.last_at ? new Date(thread.last_at).toLocaleString('vi-VN') : ''}

                    </span>

                  </div>

                </button>

              ))}

            </div>

          )}

        </aside>



        <main className={`messages-chat ${!selectedId ? 'hidden-on-mobile' : ''}`}>

          {!selectedId ? (

            <div className="messages-chat-empty">

              <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />

              <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>

            </div>

          ) : (

            <>

              <div className="messages-chat-header">

                <div className="flex-center" style={{ gap: '0.75rem' }}>

                  <button className="mobile-back-btn" onClick={() => setSelectedId(null)}>

                    <ChevronLeft size={24} />

                  </button>

                  {selectedThread?.partner_avatar ? (

                    <img src={selectedThread.partner_avatar} alt="" className="messages-avatar" />

                  ) : (

                    <div className="messages-avatar messages-avatar-fallback">{displayName.charAt(0).toUpperCase()}</div>

                  )}

                  <div>

                    <strong>{displayName}</strong>

                    <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>

                      {selectedThread?.partner_role === 'tutor' ? 'Gia sư' : selectedThread?.partner_role === 'student' ? 'Học sinh' : 'Người dùng'}

                    </p>

                  </div>

                </div>

                <Link href={`/${profileBasePath}/${selectedId}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', textDecoration: 'none' }}>

                  <User size={14} /> Xem hồ sơ

                </Link>

              </div>



              <div className="messages-chat-body" ref={chatBodyRef}>

                {loadingChat ? (

                  <p className="messages-empty">Đang tải tin nhắn...</p>

                ) : messages.length === 0 ? (

                  <p className="messages-empty">Chưa có tin nhắn. Gửi lời chào đầu tiên!</p>

                ) : (

                  messages.map((msg, idx) => {

                    const isMine = msg.sender_id === user.id;

                    return (

                      <div key={`${msg.id}-${idx}`} className={`messages-bubble ${isMine ? 'mine' : 'theirs'}`}>

                        {msg.content}

                        <span className="messages-bubble-time">

                          {new Date(msg.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' })}

                        </span>

                      </div>

                    );

                  })

                )}

              </div>



              <div className="messages-chat-input">

                <input

                  type="text"

                  placeholder="Nhập tin nhắn..."

                  value={inputValue}

                  onChange={(e) => setInputValue(e.target.value)}

                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}

                  disabled={sending}

                />

                <button type="button" className="btn btn-primary messages-send-btn" onClick={handleSend} disabled={sending || !inputValue.trim()}>

                  <Send size={16} />

                </button>

              </div>

            </>

          )}

        </main>

      </div>

    </div>

  );

}



export default function MessagesInbox({ profileBasePath }: { profileBasePath: 'tutors' | 'students' }) {

  return (

    <Suspense fallback={<div className="container messages-page"><p>Đang tải...</p></div>}>

      <MessagesInboxContent profileBasePath={profileBasePath} />

    </Suspense>

  );

}


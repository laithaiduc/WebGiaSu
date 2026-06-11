"use client";
import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import '../dashboard/tutor.css';
import { useAuth } from '@/context/AuthContext';
import { fetchReviews } from '@/lib/api';

export default function TutorReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id || user.role !== 'tutor') return;
    (async () => {
      try {
        const res = await fetchReviews(user.id);
        setReviews(res.data || []);
      } catch (err) {
        // ignore
      }
    })();
  }, [user]);
  
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (id: number) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(r => r.id === id ? { ...r, replies: [...(r.replies || []), replyText] } : r));
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="container dashboard-layout" style={{paddingTop: '3rem', paddingBottom: '4rem'}}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar glass" style={{borderRadius: '1.5rem', border: '1px solid rgba(249, 115, 22, 0.1)', boxShadow: '0 10px 30px -5px rgba(249, 115, 22, 0.1)', padding: '2rem'}}>
        <h2 style={{color: '#D94625', marginBottom: '1.5rem', fontSize: '1.5rem'}}>Quản lý Đánh giá</h2>
        <div style={{background: 'rgba(249, 115, 22, 0.05)', padding: '2rem 1.5rem', borderRadius: '1rem', textAlign: 'center'}}>
          <h1 style={{fontSize: '3.5rem', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0, lineHeight: 1}}>
            4.9 <Star size={36} fill="currentColor" />
          </h1>
          <p className="text-muted" style={{marginTop: '0.5rem'}}>Dựa trên 12 đánh giá</p>
        </div>
        
        {/* Rating Bars */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem'}}>
          {[5,4,3,2,1].map((s) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <span style={{width: '24px', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'center'}}>{s}</span>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <div style={{flex: 1, height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '1rem', overflow: 'hidden'}}>
                <div style={{height: '100%', background: '#F59E0B', width: s === 5 ? '90%' : s === 4 ? '10%' : '0%', borderRadius: '1rem'}}></div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="glass" style={{borderRadius: '1.5rem', border: '1px solid rgba(249, 115, 22, 0.1)', boxShadow: '0 10px 30px -5px rgba(249, 115, 22, 0.1)', padding: '2.5rem'}}>
          <h2 style={{marginBottom: '2.5rem', color: 'var(--text-main)', fontSize: '1.8rem'}}>Tất cả Nhận xét</h2>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            {reviews.map((review, index) => (
              <div key={review.id} style={{
                borderBottom: index === reviews.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)', 
                paddingBottom: index === reviews.length - 1 ? 0 : '2rem'
              }}>
                <div className="flex-between">
                  <div>
                    <h3 style={{fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-main)'}}>{review.author}</h3>
                    <div className="flex-center" style={{gap: '0.2rem', color: '#F59E0B', justifyContent: 'flex-start'}}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={16} fill={i <= review.stars ? "currentColor" : "none"} color={i <= review.stars ? "#F59E0B" : "var(--border)"} />
                      ))}
                    </div>
                  </div>
                  <span className="text-muted" style={{fontSize: '0.9rem', background: 'rgba(0,0,0,0.03)', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>{review.time}</span>
                </div>
                <p style={{marginTop: '1rem', color: 'var(--text-main)', lineHeight: 1.6, fontSize: '1.05rem'}}>
                  {review.content}
                </p>
                
                {/* List of Replies */}
                {review.replies && review.replies.map((reply: string, replyIndex: number) => (
                  <div key={replyIndex} style={{marginTop: '1.25rem', background: '#FFF7ED', padding: '1.25rem 1.5rem', borderRadius: '1rem', borderLeft: '4px solid var(--primary)', position: 'relative'}}>
                    <div style={{position: 'absolute', top: '-6px', left: '20px', width: '12px', height: '12px', background: '#FFF7ED', transform: 'rotate(45deg)', borderTop: '1px solid transparent', borderLeft: '1px solid transparent'}}></div>
                    <div className="flex-between" style={{marginBottom: '0.5rem'}}>
                      <strong style={{color: '#C2410C', fontSize: '0.95rem'}}>Phản hồi của bạn:</strong>
                    </div>
                    <p style={{color: '#9A3412', lineHeight: 1.5}}>{reply}</p>
                  </div>
                ))}
                
                {/* Reply Button/Input area */}
                <div style={{marginTop: '1.25rem'}}>
                  {replyingTo === review.id ? (
                    <div style={{background: '#F9FAFB', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'flex-end'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)'}}>Viết phản hồi:</label>
                        <textarea 
                          className="input-field" 
                          rows={3} 
                          placeholder="Gõ lời cảm ơn hoặc phản hồi của bạn..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{width: '100%', resize: 'vertical', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', background: 'white'}}
                          autoFocus
                        />
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button className="btn" style={{padding: '0.75rem', background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)'}} onClick={() => setReplyingTo(null)}>Hủy</button>
                        <button className="btn btn-primary flex-center" style={{padding: '0.75rem 1.25rem', gap: '0.5rem'}} onClick={() => handleSendReply(review.id)}>
                          <Send size={16} /> Gửi
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-outline flex-center" 
                      style={{gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '2rem', fontSize: '0.95rem'}}
                      onClick={() => {
                        setReplyingTo(review.id);
                        setReplyText("");
                      }}
                    >
                      <MessageSquare size={16} /> {review.replies && review.replies.length > 0 ? "Thêm phản hồi" : "Bấm để Phản hồi"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

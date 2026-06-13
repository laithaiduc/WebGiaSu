"use client";

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchReviews, postComment } from '@/lib/api';

export default function TutorReviewsTab() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!user?.id || user.role !== 'tutor') return;
    fetchReviews(user.id)
      .then(res => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Tính toán rating thực từ dữ liệu
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + (r.stars || 0), 0) / totalReviews
    : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.stars === s).length,
    pct: totalReviews > 0 ? Math.round((reviews.filter(r => r.stars === s).length / totalReviews) * 100) : 0,
  }));

  const handleSendReply = async (id: number) => {
    if (!replyText.trim()) return;
    try {
      await postComment({ entity_type: 'review', entity_id: id, content: replyText });
      setReviews(reviews.map(r =>
        r.id === id ? { ...r, replies: [...(r.replies || []), replyText] } : r
      ));
      setReplyingTo(null);
      setReplyText('');
    } catch {
      alert('Không thể gửi phản hồi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="reviews-layout">
      <style dangerouslySetInnerHTML={{ __html: `
        .reviews-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .reviews-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: rgba(249,115,22,0.04);
          border: 1px solid rgba(249,115,22,0.1);
          border-radius: 1rem;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(249,115,22,0.07);
        }
        @media (max-width: 768px) {
          .reviews-layout {
            flex-direction: column;
            gap: 1rem;
          }
          .reviews-sidebar {
            width: 100%;
          }
        }
      `}} />
      
      {/* Sidebar rating */}
      <aside className="reviews-sidebar">
        <h3 style={{ color: '#D94625', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Tổng quan đánh giá</h3>
        <div style={{ background: 'rgba(249,115,22,0.06)', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', color: '#F59E0B', fontWeight: 800, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            {avgRating.toFixed(1)} <Star size={32} fill="currentColor" />
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Dựa trên {totalReviews} đánh giá
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {ratingCounts.map(({ star, count, pct }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
              <span style={{ width: '20px', fontWeight: 700, textAlign: 'center' }}>{star}</span>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#F59E0B', width: `${pct}%`, borderRadius: '1rem', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ color: 'var(--text-muted)', width: '28px', textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Reviews list */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="card glass" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '2rem', color: 'var(--text-main)', fontSize: '1.4rem' }}>
            Tất cả nhận xét {totalReviews > 0 && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>({totalReviews})</span>}
          </h2>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Đang tải...</p>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Star size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
              <p>Bạn chưa có đánh giá nào.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {reviews.map((review, index) => (
                <div key={review.id} style={{
                  borderBottom: index === reviews.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  paddingBottom: index === reviews.length - 1 ? 0 : '2rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                        {review.author_name || review.author || 'Học sinh'}
                      </h3>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={15} fill={i <= review.stars ? '#F59E0B' : 'none'} color={i <= review.stars ? '#F59E0B' : 'var(--border)'} />
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.7rem', borderRadius: '1rem' }}>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString('vi-VN') : review.time || ''}
                    </span>
                  </div>
                  {review.content && (
                    <p style={{ marginTop: '0.75rem', color: 'var(--text-main)', lineHeight: 1.65, fontSize: '0.975rem' }}>
                      {review.content}
                    </p>
                  )}
                  {/* Replies */}
                  {review.replies?.map((reply: string, ri: number) => (
                    <div key={ri} style={{ marginTop: '1rem', background: '#FFF7ED', padding: '1rem 1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--primary)' }}>
                      <p style={{ fontWeight: 600, color: '#C2410C', fontSize: '0.875rem', marginBottom: '0.3rem' }}>Phản hồi của bạn</p>
                      <p style={{ color: '#9A3412', lineHeight: 1.5, fontSize: '0.925rem' }}>{reply}</p>
                    </div>
                  ))}
                  {/* Reply UI */}
                  <div style={{ marginTop: '1rem' }}>
                    {replyingTo === review.id ? (
                      <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Viết phản hồi</label>
                          <textarea className="input-field" rows={3} placeholder="Gõ lời cảm ơn hoặc phản hồi..."
                            value={replyText} onChange={e => setReplyText(e.target.value)}
                            style={{ width: '100%', resize: 'vertical' }} autoFocus />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <button className="btn" style={{ padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)', fontSize: '0.85rem' }} onClick={() => setReplyingTo(null)}>Hủy</button>
                          <button className="btn btn-primary" style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }} onClick={() => handleSendReply(review.id)}>
                            <Send size={14} /> Gửi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.875rem' }}
                        onClick={() => { setReplyingTo(review.id); setReplyText(''); }}>
                        <MessageSquare size={14} /> {review.replies?.length > 0 ? 'Thêm phản hồi' : 'Phản hồi'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

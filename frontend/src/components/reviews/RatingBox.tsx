"use client";
import { useState } from 'react';
import { Star } from 'lucide-react';
import { postReview } from '@/lib/api';

export default function RatingBox({
  isLocked = false,
  tutorId,
  onReviewPosted,
}: {
  isLocked?: boolean;
  tutorId?: number;
  onReviewPosted?: () => void;
}) {
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!tutorId || selectedStar === 0) return;
    setSubmitting(true);
    try {
      await postReview({ tutor_id: tutorId, stars: selectedStar, content });
      setSelectedStar(0);
      setContent('');
      onReviewPosted?.();
      alert('Đã gửi đánh giá!');
    } catch (err: any) {
      alert(err?.message || 'Không thể gửi đánh giá.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Đánh giá Gia sư</h3>

      {isLocked ? (
        <div style={{ background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>🔒 Bạn chỉ có thể đánh giá gia sư này khi đăng nhập với tài khoản học sinh.</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setSelectedStar(star)}
              >
                <Star
                  size={28}
                  fill={(hoverStar || selectedStar) >= star ? "#F59E0B" : "transparent"}
                  color={(hoverStar || selectedStar) >= star ? "#F59E0B" : "var(--border)"}
                />
              </button>
            ))}
          </div>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Chia sẻ trải nghiệm học tập của bạn với gia sư này..."
            style={{ width: '100%', resize: 'vertical', marginBottom: '1rem' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div style={{ textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary" disabled={selectedStar === 0 || submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

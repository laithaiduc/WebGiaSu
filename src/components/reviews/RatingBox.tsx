"use client";
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingBox({ isLocked = false }: { isLocked?: boolean }) {
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);

  return (
    <div className="card glass" style={{padding: '1.5rem', marginBottom: '2rem'}}>
      <h3 style={{marginBottom: '1rem', fontSize: '1.1rem'}}>Đánh giá Gia sư</h3>
      
      {isLocked ? (
        <div style={{background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-muted)'}}>
          <p>🔒 Bạn chỉ có thể đánh giá gia sư này sau khi <strong>kết nối thành công</strong> và có quá trình học tập thực tế.</p>
        </div>
      ) : (
        <form>
          <div style={{display: 'flex', gap: '0.25rem', marginBottom: '1rem'}}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
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
            style={{width: '100%', resize: 'vertical', marginBottom: '1rem'}}
          ></textarea>
          <div style={{textAlign: 'right'}}>
            <button type="button" className="btn btn-primary" disabled={selectedStar === 0}>Gửi Đánh Giá</button>
          </div>
        </form>
      )}
    </div>
  );
}

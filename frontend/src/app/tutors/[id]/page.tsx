"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star, MapPin, Briefcase, Award, CheckCircle,
  Heart, MessageCircle, Phone, Users, BookOpen,
  DollarSign, Clock, ChevronRight,
} from 'lucide-react';
import CommentSection from '@/components/comments/CommentSection';
import RatingBox from '@/components/reviews/RatingBox';
import { useAuth } from '@/context/AuthContext';
import {
  fetchTutorById,
  fetchReviews,
  saveTutorProfile,
  unsaveTutorProfile,
  fetchSavedTutorsForStudent,
} from '@/lib/api';
import type { TutorProfile } from '@/lib/types';
import '../../profile.css';

function maskPhone(value: string) {
  const clean = value.replace(/\s+/g, '');
  return clean.length > 7
    ? `${clean.substring(0, 3)}••••${clean.substring(clean.length - 4)}`
    : value;
}

function StarRating({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= count ? 'currentColor' : 'none'}
          color={i <= count ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
    </div>
  );
}

export default function TutorProfilePublic() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const tutorId = Number(params?.id || 0);

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingState, setSavingState] = useState(false);

  useEffect(() => {
    if (!tutorId) return;
    setLoading(true);
    Promise.all([fetchTutorById(tutorId), fetchReviews(tutorId)])
      .then(([tutorRes, reviewRes]) => {
        setTutor(tutorRes.data);
        setReviews(reviewRes.data || []);
      })
      .catch(() => { setTutor(null); setReviews([]); })
      .finally(() => setLoading(false));
  }, [tutorId]);

  useEffect(() => {
    if (!user || user.role !== 'student') return;
    fetchSavedTutorsForStudent(user.id)
      .then((res) => {
        const list = res.data || [];
        setIsSaved(!!list.find((t: any) => t.id === tutorId));
      })
      .catch(() => {});
  }, [user, tutorId]);

  const handleToggleSave = async () => {
    if (!user) { alert('Vui lòng đăng nhập để lưu hồ sơ.'); return; }
    setSavingState(true);
    try {
      if (isSaved) {
        await unsaveTutorProfile(tutorId);
        setIsSaved(false);
      } else {
        await saveTutorProfile(tutorId);
        setIsSaved(true);
      }
    } catch (err: any) {
      alert(err?.message || 'Lỗi khi lưu hồ sơ');
    } finally {
      setSavingState(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner" />
        <p>Đang tải hồ sơ gia sư...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="container profile-page">
        <p style={{ color: 'var(--text-muted)' }}>Không tìm thấy gia sư.</p>
      </div>
    );
  }

  const subjectTags = tutor.subjects ? tutor.subjects.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const gradeTags   = tutor.grades   ? tutor.grades.split(',').map((g) => g.trim()).filter(Boolean)   : [];
  const phone = tutor.phone ? maskPhone(tutor.phone) : 'Chưa cập nhật';

  const avgRating = tutor.rating ?? 0;

  return (
    <div className="container profile-page">
      <div className="profile-layout">

        {/* ═══════ LEFT COLUMN ═══════ */}
        <div>

          {/* ── HERO ── */}
          <div className="profile-hero">
            <div className="profile-hero-inner">
              <div className="profile-avatar-wrap">
                {tutor.avatar ? (
                  <img src={tutor.avatar} alt="avatar" className="profile-avatar" />
                ) : (
                  <div
                    className="profile-avatar-fallback"
                    style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                  >
                    {tutor.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="profile-avatar-badge">
                  <CheckCircle size={14} color="white" fill="#10B981" />
                </div>
              </div>

              <div className="profile-hero-info">
                <div className="profile-name-row">
                  <h1 className="profile-name">{tutor.name}</h1>
                  {avgRating > 0 && (
                    <span className="profile-rating-chip">
                      <Star size={13} fill="currentColor" />
                      {avgRating.toFixed(1)}
                      <span style={{ fontWeight: 400, opacity: 0.7 }}>({tutor.review_count})</span>
                    </span>
                  )}
                </div>

                <p className="profile-subtitle">
                  {tutor.experience_years
                    ? `Gia sư • ${tutor.experience_years} năm kinh nghiệm`
                    : 'Gia sư'}
                </p>

                <div className="profile-meta-row">
                  {tutor.location && (
                    <span className="profile-meta-item">
                      <MapPin size={15} /> {tutor.location}
                    </span>
                  )}
                  {tutor.formats && (
                    <span className="profile-meta-item">
                      <Briefcase size={15} /> {tutor.formats}
                    </span>
                  )}
                  {tutor.gender && (
                    <span className="profile-meta-item">
                      <Users size={15} /> {tutor.gender}
                    </span>
                  )}
                  <span className="profile-meta-item">
                    <Phone size={15} /> {phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── BIO ── */}
          <div className="profile-section">
            <h2 className="profile-section-title">
              <span className="icon-wrap"><Award size={18} /></span>
              Giới thiệu &amp; Kinh nghiệm
            </h2>
            <p className="profile-bio">{tutor.bio || 'Gia sư chưa cập nhật phần giới thiệu.'}</p>

            {(subjectTags.length > 0 || gradeTags.length > 0) && (
              <>
                <hr className="profile-section-divider" />
                <p className="profile-sub-heading">
                  <BookOpen size={16} style={{ color: 'var(--primary)' }} />
                  Môn học &amp; Khối lớp
                </p>
                <div className="profile-tags">
                  {subjectTags.map((tag) => (
                    <span key={tag} className="profile-tag">{tag}</span>
                  ))}
                  {gradeTags.map((tag) => (
                    <span key={tag} className="profile-tag grade">{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── COMMENTS ── */}
          <div className="profile-section">
            <CommentSection entityType="tutors" entityId={tutorId} />
          </div>

          {/* ── REVIEWS ── */}
          <div className="profile-section">
            <h2 className="profile-section-title">
              <span className="icon-wrap"><Star size={18} /></span>
              Đánh giá từ học sinh
            </h2>

            <RatingBox
              isLocked={user?.role !== 'student'}
              tutorId={tutorId}
              onReviewPosted={() =>
                fetchReviews(tutorId).then((r) => setReviews(r.data || []))
              }
            />

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
                Chưa có đánh giá nào.
              </p>
            ) : (
              <div className="reviews-list" style={{ marginTop: '1.25rem' }}>
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div>
                        <div className="review-author-name">{review.author_name}</div>
                        <StarRating count={review.stars} />
                      </div>
                      {review.created_at && (
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                    {review.content && (
                      <p className="review-content">{review.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ═══════ SIDEBAR ═══════ */}
        <div>
          <div className="profile-sidebar-card">

            {/* Price */}
            <div className="profile-price-block">
              <p className="profile-price-label">Học phí tham khảo</p>
              <h2 className="profile-price-value">
                {tutor.price_per_hour
                  ? tutor.price_per_hour.toLocaleString('vi-VN') + 'đ'
                  : 'Thỏa thuận'}
              </h2>
              {tutor.price_per_hour > 0 && (
                <span className="profile-price-unit">/buổi</span>
              )}
            </div>

            {/* CTA – contact */}
            <button
              className="profile-action-btn primary"
              onClick={() => {
                if (!user) { alert('Vui lòng đăng nhập để nhắn tin.'); return; }
                if (user.role === 'student') {
                  router.push(`/students/messages?with=${tutorId}`);
                } else {
                  router.push(`/tutors/messages?with=${tutorId}`);
                }
              }}
            >
              <MessageCircle size={18} />
              Liên hệ / Đặt lớp ngay
            </button>

            {/* CTA – save */}
            <button
              className={`profile-action-btn outline ${isSaved ? 'saved' : ''}`}
              onClick={handleToggleSave}
              disabled={savingState}
            >
              <Heart size={18} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : 'currentColor'} />
              {isSaved ? 'Đã lưu hồ sơ' : 'Lưu hồ sơ'}
            </button>

            <hr className="profile-divider" />

            {/* Info list */}
            <div className="profile-info-list">
              <div className="profile-info-row">
                <span className="label">Giới tính</span>
                <span className="value">{tutor.gender || '—'}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Số điện thoại</span>
                <span className="value">{phone}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Hình thức dạy</span>
                <span className="value">{tutor.formats || 'Online & Offline'}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Vùng miền</span>
                <span className="value">{tutor.region || '—'}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Trạng thái</span>
                <span className={`profile-status-chip ${tutor.is_accepting ? 'accepting' : 'not-accepting'}`}>
                  {tutor.is_accepting ? '● Đang nhận lớp' : '● Ngừng nhận lớp'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

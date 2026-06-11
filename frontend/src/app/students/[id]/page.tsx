"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Target, BookOpen, CheckCircle,
  Heart, MessageCircle, Phone, Users,
  GraduationCap, Clock,
} from 'lucide-react';
import CommentSection from '@/components/comments/CommentSection';
import { useAuth } from '@/context/AuthContext';
import {
  saveStudentProfile,
  unsaveStudentProfile,
  fetchSavedStudentsForTutor,
  sendMessage,
  fetchUserById,
} from '@/lib/api';
import '../../profile.css';

function maskPhone(value: string) {
  const clean = value.replace(/\s+/g, '');
  return clean.length > 7
    ? `${clean.substring(0, 3)}••••${clean.substring(clean.length - 4)}`
    : value;
}

export default function StudentProfilePublic() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const entityId = Number(params?.id || 0);

  const [studentName, setStudentName]     = useState('');
  const [studentAvatar, setStudentAvatar] = useState('');
  const [phone, setPhone]                 = useState('');
  const [gender, setGender]               = useState('');
  const [loading, setLoading]             = useState(true);

  const [isSaved, setIsSaved]             = useState(false);
  const [savingState, setSavingState]     = useState(false);

  /* Load student info */
  useEffect(() => {
    if (!entityId) return;
    setLoading(true);
    fetchUserById(entityId)
      .then((res) => {
        const profile = res.data;
        if (!profile) return;
        setStudentName(profile.name || 'Học sinh');
        setStudentAvatar(profile.avatar || '');
        if (profile.phone) setPhone(maskPhone(profile.phone));
        if (profile.gender) setGender(profile.gender);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [entityId]);

  /* Check saved status */
  useEffect(() => {
    if (user?.role !== 'tutor') return;
    fetchSavedStudentsForTutor(user.id)
      .then((data) => {
        const list = data.data || [];
        setIsSaved(!!list.find((s: any) => s.id === entityId));
      })
      .catch(() => {});
  }, [user, entityId]);

  const handleToggleSave = async () => {
    if (!user) { alert('Vui lòng đăng nhập để lưu hồ sơ.'); return; }
    setSavingState(true);
    try {
      if (isSaved) {
        await unsaveStudentProfile(entityId);
        setIsSaved(false);
      } else {
        await saveStudentProfile(entityId);
        setIsSaved(true);
      }
    } catch (err: any) {
      alert(err?.message || 'Lỗi khi lưu hồ sơ');
    } finally {
      setSavingState(false);
    }
  };

  const handleContact = () => {
    if (!user) { alert('Vui lòng đăng nhập để nhắn tin.'); return; }
    if (user.role === 'tutor') {
      router.push(`/tutors/messages?with=${entityId}`);
    } else {
      router.push(`/students/messages?with=${entityId}`);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner" />
        <p>Đang tải hồ sơ học sinh...</p>
      </div>
    );
  }

  return (
    <div className="container profile-page">
      <div className="profile-layout">

        {/* ═══════ LEFT COLUMN ═══════ */}
        <div>

          {/* ── HERO ── */}
          <div className="profile-hero">
            <div className="profile-hero-inner">
              <div className="profile-avatar-wrap">
                {studentAvatar ? (
                  <img src={studentAvatar} alt="avatar" className="profile-avatar" />
                ) : (
                  <div
                    className="profile-avatar-fallback"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >
                    {(studentName || 'H').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="profile-avatar-badge">
                  <CheckCircle size={14} color="white" fill="#10B981" />
                </div>
              </div>

              <div className="profile-hero-info">
                <div className="profile-name-row">
                  <h1 className="profile-name">{studentName || 'Học sinh'}</h1>
                </div>

                <p className="profile-subtitle">Học sinh</p>

                <div className="profile-meta-row">
                  {gender && (
                    <span className="profile-meta-item">
                      <Users size={15} /> {gender}
                    </span>
                  )}
                  {phone && (
                    <span className="profile-meta-item">
                      <Phone size={15} /> {phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── LEARNING GOALS ── */}
          <div className="profile-section">
            <h2 className="profile-section-title">
              <span className="icon-wrap"><Target size={18} /></span>
              Mục tiêu &amp; Nhu cầu học tập
            </h2>
            <p className="profile-bio">
              Học sinh chưa cập nhật mục tiêu học tập. Hãy liên hệ trực tiếp để trao đổi thêm.
            </p>

            <hr className="profile-section-divider" />

            <p className="profile-sub-heading">
              <BookOpen size={16} style={{ color: 'var(--primary)' }} />
              Các môn đang cần học
            </p>
            <div className="profile-tags">
              <span className="profile-tag">Tiếng Anh</span>
              <span className="profile-tag">Toán</span>
            </div>
          </div>

          {/* ── COMMENTS / Q&A ── */}
          <div className="profile-section">
            <CommentSection entityType="students" entityId={entityId} />
          </div>

        </div>

        {/* ═══════ SIDEBAR ═══════ */}
        <div>
          <div className="profile-sidebar-card">

            {/* Budget */}
            <div className="profile-price-block">
              <p className="profile-price-label">Học phí sẵn sàng chi trả</p>
              <h2 className="profile-price-value">Thỏa thuận</h2>
            </div>

            {/* CTA – contact */}
            <button className="profile-action-btn primary" onClick={handleContact}>
              <MessageCircle size={18} />
              Liên hệ / Nhận lớp ngay
            </button>

            {/* CTA – save (tutor only) */}
            {user?.role === 'tutor' && (
              <button
                className={`profile-action-btn outline ${isSaved ? 'saved' : ''}`}
                onClick={handleToggleSave}
                disabled={savingState}
              >
                <Heart size={18} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : 'currentColor'} />
                {isSaved ? 'Đã lưu học sinh' : 'Lưu hồ sơ học sinh'}
              </button>
            )}

            <hr className="profile-divider" />

            {/* Info list */}
            <div className="profile-info-list">
              <div className="profile-info-row">
                <span className="label">Giới tính</span>
                <span className="value">{gender || '—'}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Số điện thoại</span>
                <span className="value">{phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Hình thức mong muốn</span>
                <span className="value">Online hoặc Offline</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Trạng thái</span>
                <span className="profile-status-chip accepting">
                  ● Đang tìm gia sư
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

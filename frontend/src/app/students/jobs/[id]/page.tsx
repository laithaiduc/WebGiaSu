"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Clock, Users, ArrowLeft, CheckCircle, ShieldCheck, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import '../../../tutors/jobs/jobs.css';
import { applyToPost, fetchPosts, fetchReviews } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = parseInt(params.id as string);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [tutorReviews, setTutorReviews] = useState<any[]>([]);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await fetchPosts('tutor');
        const post = (res.data || []).find((p: any) => p.id === id);
        if (!post) { setNotFound(true); return; }

        const jobData = {
          id: post.id,
          title: post.title ?? '',
          tutorName: post.author_name ?? post.authorName ?? '',
          tutorInitials: (post.author_name || post.authorName || '').charAt(0).toUpperCase(),
          tutorId: post.author_id ?? post.authorId ?? 0,
          subject: post.subject ?? '',
          grade: post.grade ?? '',
          price: post.price ?? '',
          format: post.format ?? '',
          schedule: post.time ?? '',
          description: post.description ?? post.desc ?? '',
          interested: post.applicants ?? 0,
          classType: post.classType ?? post.class_type ?? '',
          maxStudents: Number(post.maxStudents ?? post.max_students ?? 0),
          registeredStudents: Number(post.registeredStudents ?? post.registered_students ?? 0),
          postedAt: post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : '',
          status: post.status ?? '',
        };
        setJob(jobData);

        // Tải đánh giá của gia sư
        if (jobData.tutorId) {
          fetchReviews(jobData.tutorId)
            .then(r => setTutorReviews(r.data || []))
            .catch(() => setTutorReviews([]));
        }
      } catch (error) {
        console.error('Failed to load tutor job details', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const avgRating = tutorReviews.length > 0
    ? tutorReviews.reduce((s, r) => s + (Number(r.stars) || 0), 0) / tutorReviews.length
    : 0;

  const handleRegister = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để đăng ký học!');
      router.push('/login');
      return;
    }
    if (user.role !== 'student') {
      alert('Chỉ học sinh mới có thể đăng ký lớp học.');
      return;
    }
    if (!job) return;
    if (job.classType === 'group' && job.registeredStudents >= job.maxStudents) {
      alert('Lớp học này đã đủ số lượng học viên!');
      return;
    }

    setApplying(true);
    try {
      await applyToPost(job.id);
      setApplied(true);
      setJob((prev: any) => prev ? {
        ...prev,
        interested: (prev.interested || 0) + 1,
        registeredStudents: prev.classType === 'group' ? (prev.registeredStudents || 0) + 1 : prev.registeredStudents,
      } : prev);
    } catch (err: any) {
      alert(err.message || 'Không thể đăng ký. Vui lòng thử lại sau.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải dữ liệu...</div>;
  if (!job || notFound) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy thông tin lớp học.</div>;

  const isFull = job.classType === 'group' && job.registeredStudents >= job.maxStudents;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link href="/students/jobs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', border: 'none', background: 'var(--background)', color: 'var(--text-main)' }}>
        <ArrowLeft size={18} /> Quay lại bảng tin
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Class Info */}
          <div className="card glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {job.classType === 'group'
                  ? <span className="tag" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', fontWeight: 'bold', fontSize: '0.9rem', padding: '0.35rem 0.9rem' }}>Lớp Nhóm</span>
                  : <span className="tag" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', fontWeight: 'bold', fontSize: '0.9rem', padding: '0.35rem 0.9rem' }}>Kèm 1-1</span>}
                {job.grade && <span className="tag" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--primary)', fontSize: '0.9rem', padding: '0.35rem 0.9rem' }}>{job.grade}</span>}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> Đăng {job.postedAt}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', color: '#D94625', marginBottom: '1.5rem', lineHeight: 1.3 }}>{job.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', background: 'var(--background)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Môn học</span><strong>{job.subject}</strong></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Học phí</span><strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{job.price}</strong></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Hình thức</span><strong>{job.format}</strong></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Lịch học</span><strong>{job.schedule || 'Thỏa thuận'}</strong></div>
            </div>

            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Nội dung khóa học</h3>
            <p style={{ lineHeight: 1.8, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{job.description || 'Gia sư chưa cung cấp mô tả chi tiết.'}</p>
          </div>

          {/* Reviews */}
          {tutorReviews.length > 0 && (
            <div className="card glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={18} color="#F59E0B" fill="#F59E0B" /> Đánh giá về gia sư ({tutorReviews.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {tutorReviews.slice(0, 3).map((review, i) => (
                  <div key={review.id || i} style={{ paddingBottom: i < Math.min(tutorReviews.length, 3) - 1 ? '1.25rem' : 0, borderBottom: i < Math.min(tutorReviews.length, 3) - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{review.author_name || 'Học sinh'}</strong>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= review.stars ? '#F59E0B' : 'none'} color={s <= review.stars ? '#F59E0B' : 'var(--border)'} />)}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="card glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} /> Quyền lợi khi đăng ký qua GiaSư KếtNối
            </h3>
            <ul style={{ lineHeight: 1.9, color: 'var(--text-muted)', paddingLeft: '1.25rem' }}>
              <li>Được học thử 1-2 buổi đầu để đánh giá sự phù hợp</li>
              <li>Hỗ trợ đổi gia sư miễn phí nếu không hiệu quả</li>
              <li>Thanh toán học phí an toàn, minh bạch</li>
              <li>Đội ngũ CSKH hỗ trợ trong suốt quá trình học</li>
            </ul>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <div className="card glass" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>

            {/* Tutor Info */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold', flexShrink: 0 }}>
                {job.tutorInitials}
              </div>
              <div>
                <Link href={`/tutors/${job.tutorId}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {job.tutorName} <CheckCircle size={15} color="#10B981" />
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {tutorReviews.length > 0 ? avgRating.toFixed(1) : 'Chưa có'}
                  </span>
                  {tutorReviews.length > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({tutorReviews.length} đánh giá)</span>}
                </div>
              </div>
            </div>

            {/* Slot count */}
            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', textAlign: 'center' }}>
              {job.classType === 'group' ? (
                <>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Sĩ số lớp học</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Users size={18} color={isFull ? '#EF4444' : '#10B981'} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: isFull ? '#EF4444' : '#10B981' }}>
                      {job.registeredStudents} / {job.maxStudents}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>học viên</span>
                  </div>
                  {isFull && <p style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '0.4rem' }}>Lớp đã đầy</p>}
                  {!isFull && <p style={{ color: '#10B981', fontSize: '0.85rem', marginTop: '0.4rem' }}>Còn {job.maxStudents - job.registeredStudents} chỗ trống</p>}
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Học sinh quan tâm</p>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{job.interested}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.4rem' }}>người</span>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            {applied ? (
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle size={32} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ color: '#10B981', fontWeight: 700, marginBottom: '0.25rem' }}>Đã đăng ký thành công!</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gia sư sẽ liên hệ bạn sớm</p>
              </div>
            ) : (
              <>
                <button
                  className={`btn ${isFull ? 'btn-outline' : 'btn-primary'}`}
                  style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={handleRegister}
                  disabled={isFull || applying}
                >
                  {applying ? 'Đang đăng ký...' : isFull ? 'Lớp đã đủ số lượng' : (
                    <><Send size={18} /> Đăng ký học ngay</>
                  )}
                </button>
                <Link
                  href={`/students/messages?with=${job.tutorId}`}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <MessageSquare size={16} /> Nhắn tin với gia sư
                </Link>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                  Miễn phí đăng ký giữ chỗ
                </p>
              </>
            )}

            <Link href={`/tutors/${job.tutorId}`} className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              Xem hồ sơ đầy đủ của gia sư
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

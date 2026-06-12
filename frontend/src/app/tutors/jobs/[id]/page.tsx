"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User, MapPin, BookOpen, DollarSign, Send, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import '../jobs.css';
import { fetchPosts, applyToPost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function TutorJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = parseInt(params.id as string);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await fetchPosts('student');
        const post = (res.data || []).find((p: any) => p.id === id);
        if (!post) { setNotFound(true); return; }
        setJob({
          id: post.id,
          title: post.title ?? '',
          authorName: post.author_name ?? 'Học sinh',
          authorId: post.author_id ?? 0,
          subject: post.subject ?? '',
          grade: post.grade ?? '',
          format: post.format ?? '',
          price: post.price ?? '',
          schedule: post.time ?? '',
          description: post.description ?? '',
          status: post.status ?? '',
          applicants: post.applicants ?? 0,
          postedAt: post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới đây',
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để ứng tuyển!');
      router.push('/login');
      return;
    }
    if (user.role !== 'tutor') {
      alert('Chỉ gia sư mới có thể ứng tuyển vào lớp học này.');
      return;
    }
    setApplying(true);
    try {
      await applyToPost(id);
      setApplied(true);
      setJob((prev: any) => prev ? { ...prev, applicants: (prev.applicants || 0) + 1 } : prev);
    } catch (err: any) {
      alert(err.message || 'Không thể ứng tuyển. Vui lòng thử lại sau.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>;
  if (!job || notFound) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy bài đăng.</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link href="/tutors/jobs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', border: 'none', background: 'var(--background)', color: 'var(--text-main)' }}>
        <ArrowLeft size={18} /> Quay lại bảng tin
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {job.grade && <span className="tag" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--primary)', fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>{job.grade}</span>}
                {job.format && <span className="tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>{job.format}</span>}
                <span className="tag" style={{ background: job.status === 'Đang tìm gia sư' ? 'rgba(249,115,22,0.08)' : 'rgba(0,0,0,0.05)', color: job.status === 'Đang tìm gia sư' ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>
                  {job.status}
                </span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> Đăng {job.postedAt}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', color: '#D94625', marginBottom: '1.5rem', lineHeight: 1.3 }}>{job.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem', background: 'var(--background)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <BookOpen size={13} /> Môn học
                </span>
                <strong>{job.subject || 'Chưa xác định'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <DollarSign size={13} /> Học phí
                </span>
                <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{job.price || 'Thỏa thuận'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} /> Hình thức
                </span>
                <strong>{job.format || 'Thỏa thuận'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={13} /> Lịch học
                </span>
                <strong>{job.schedule || 'Thỏa thuận'}</strong>
              </div>
            </div>

            {job.description && (
              <>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Yêu cầu & mô tả</h3>
                <p style={{ lineHeight: 1.8, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{job.description}</p>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          <div className="card glass" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>

            {/* Student Info */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                {job.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <Link href={`/students/${job.authorId}`} style={{ fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none', fontSize: '1rem' }}>
                  {job.authorName}
                </Link>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <User size={12} /> Học sinh
                </p>
              </div>
            </div>

            {/* Applicants count */}
            <div style={{ background: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Gia sư đã ứng tuyển</p>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{job.applicants}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.4rem' }}>người</span>
            </div>

            {/* CTA */}
            {applied ? (
              <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle size={36} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ color: '#10B981', fontWeight: 700, marginBottom: '0.25rem' }}>Đã ứng tuyển!</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Học sinh sẽ liên hệ bạn sớm</p>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? 'Đang gửi...' : <><Send size={18} /> Ứng tuyển ngay</>}
                </button>
                <Link
                  href={`/tutors/messages?with=${job.authorId}`}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
                >
                  <MessageSquare size={16} /> Nhắn tin với học sinh
                </Link>
              </>
            )}

            <Link href={`/students/${job.authorId}`} style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'underline' }}>
              Xem hồ sơ học sinh
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

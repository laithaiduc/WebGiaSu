"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Users, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import '../../../tutors/jobs/jobs.css';
import { applyToPost, fetchPosts } from '@/lib/api';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await fetchPosts('tutor');
        const post = (res.data || []).find((p: any) => p.id === id);
        if (!post) {
          setNotFound(true);
          return;
        }

        setJob({
          id: post.id,
          title: post.title ?? '',
          tutorName: post.author_name ?? post.authorName ?? '',
          tutorInitials: (post.author_name || post.authorName || '').charAt(0).toUpperCase(),
          tutorId: post.author_id ?? post.authorId ?? 0,
          tutorRating: post.tutorRating ?? 0,
          subject: post.subject ?? '',
          price: post.price ?? '',
          format: post.format ?? '',
          schedule: post.schedule ?? post.time ?? '',
          description: post.description ?? post.desc ?? '',
          interested: post.applicants ?? 0,
          classType: post.classType ?? post.class_type ?? '',
          maxStudents: post.maxStudents ?? post.max_students ?? 0,
          registeredStudents: post.registeredStudents ?? post.registered_students ?? 0,
          postedAt: post.postedAt ?? '',
          color: post.color ?? ''
        });
      } catch (error) {
        console.error('Failed to load tutor job details', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleRegister = async () => {
    if (!job) return;
    
    if (job.classType === 'group' && job.registeredStudents >= job.maxStudents) {
      alert("Lớp học này đã đủ số lượng học viên!");
      return;
    }

    try {
      await applyToPost(job.id);
      setJob((prev: any) => prev ? {
        ...prev,
        interested: (prev.interested || 0) + 1,
        registeredStudents: prev.classType === 'group' ? (prev.registeredStudents || 0) + 1 : prev.registeredStudents,
      } : prev);
    } catch (error) {
      console.error('Failed to apply to post', error);
      alert('Không thể đăng ký lớp học hiện tại. Vui lòng thử lại sau.');
      return;
    }

    alert("Đăng ký thành công! Yêu cầu của bạn đã được ghi nhận.");
    router.push('/students/jobs');
  };

  if (loading) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Đang tải dữ liệu...</div>;
  if (!job || notFound) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Không tìm thấy thông tin lớp học.</div>;

  const isFull = job.classType === 'group' && job.registeredStudents >= job.maxStudents;

  return (
    <div className="container" style={{paddingTop: '2rem', paddingBottom: '4rem'}}>
      <Link href="/students/jobs" className="btn btn-outline" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', border: 'none', background: 'var(--background)', color: 'var(--text-main)'}}>
        <ArrowLeft size={18} /> Quay lại bảng tin
      </Link>
      
      <div className="content-layout" style={{display: 'flex', gap: '2rem'}}>
        {/* Main Content */}
        <div style={{flex: 1}}>
          <div className="card glass" style={{padding: '2rem', marginBottom: '2rem'}}>
            <div className="flex-between" style={{marginBottom: '1rem'}}>
              <div className="flex-center" style={{gap: '0.5rem'}}>
                {job.classType === 'group' ? (
                  <span className="tag" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 'bold', fontSize: '1rem', padding: '0.4rem 1rem'}}>Lớp Nhóm</span>
                ) : (
                  <span className="tag" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', fontWeight: 'bold', fontSize: '1rem', padding: '0.4rem 1rem'}}>Kèm 1-1</span>
                )}
              </div>
              <span className="text-muted flex-center" style={{gap: '0.5rem'}}><Clock size={16}/> Đăng {job.postedAt}</span>
            </div>
            
            <h1 style={{fontSize: '2rem', color: '#D94625', marginBottom: '1.5rem'}}>{job.title}</h1>
            
            <div className="job-details" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-sm)'}}>
              <div><strong className="text-muted">Môn học:</strong> <span style={{fontSize: '1.1rem'}}>{job.subject}</span></div>
              <div><strong className="text-muted">Học phí:</strong> <span style={{fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold'}}>{job.price}</span></div>
              <div><strong className="text-muted">Hình thức:</strong> <span style={{fontSize: '1.1rem'}}>{job.format}</span></div>
              <div><strong className="text-muted">Lịch học:</strong> <span style={{fontSize: '1.1rem'}}>{job.schedule}</span></div>
            </div>
            
            <h3 style={{marginBottom: '1rem', fontSize: '1.3rem'}}>Chi tiết khóa học</h3>
            <p style={{lineHeight: 1.8, color: 'var(--text-main)', fontSize: '1.05rem', whiteSpace: 'pre-line'}}>
              {job.description}
            </p>
          </div>
          
          <div className="card glass" style={{padding: '2rem'}}>
            <h3 style={{marginBottom: '1rem', fontSize: '1.3rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <ShieldCheck size={24} /> Quyền lợi khi đăng ký qua TutorConnect
            </h3>
            <ul style={{lineHeight: 1.8, color: 'var(--text-muted)', paddingLeft: '1.5rem'}}>
              <li>Được học thử 1-2 buổi đầu tiên để đánh giá sự phù hợp.</li>
              <li>Hỗ trợ đổi gia sư miễn phí nếu cảm thấy không hiệu quả.</li>
              <li>Thanh toán học phí an toàn, minh bạch qua hệ thống (tùy chọn).</li>
              <li>Đội ngũ CSKH hỗ trợ trong suốt quá trình học tập.</li>
            </ul>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{width: '350px', flexShrink: 0}}>
          <div className="card glass" style={{padding: '1.5rem', position: 'sticky', top: '90px'}}>
            <h3 style={{marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem'}}>Thông tin Gia sư</h3>
            
            <div className="flex-center" style={{gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{width: '60px', height: '60px', borderRadius: '50%', background: job.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold'}}>
                {job.tutorInitials}
              </div>
              <div>
                <Link href={`/tutors/${job.tutorId}`} style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  {job.tutorName} <CheckCircle size={16} color="#10B981" />
                </Link>
                <div className="flex-center" style={{gap: '0.25rem', color: '#F59E0B', marginTop: '0.25rem'}}>
                  <Star size={16} fill="currentColor"/> 
                  <span style={{fontWeight: 'bold', color: 'var(--text-main)'}}>{job.tutorRating.toFixed(1)}</span>
                  <span className="text-muted" style={{marginLeft: '0.25rem'}}>(12 đánh giá)</span>
                </div>
              </div>
            </div>
            
            <Link href={`/tutors/${job.tutorId}`} className="btn btn-outline" style={{width: '100%', marginBottom: '2rem', textAlign: 'center'}}>Xem hồ sơ Gia sư</Link>
            
            <div style={{background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center'}}>
              {job.classType === 'group' ? (
                <>
                  <p className="text-muted" style={{marginBottom: '0.5rem'}}>Sĩ số lớp học</p>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: isFull ? '#EF4444' : 'var(--text-main)'}}>
                    {job.registeredStudents} / {job.maxStudents} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>học viên</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted" style={{marginBottom: '0.5rem'}}>Số lượng quan tâm</p>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)'}}>
                    {job.interested} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>học viên</span>
                  </div>
                </>
              )}
            </div>
            
            <button 
              className={`btn ${isFull ? 'btn-outline' : 'btn-primary'}`} 
              style={{width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold'}} 
              onClick={handleRegister} 
              disabled={isFull}
            >
              {isFull ? 'Lớp đã đủ số lượng' : 'Đăng ký học ngay'}
            </button>
            <p style={{textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem'}}>
              Không thu phí khi đăng ký giữ chỗ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

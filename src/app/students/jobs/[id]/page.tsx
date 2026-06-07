"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Users, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import '../../../tutors/jobs/jobs.css';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    // Find job from localStorage tutorPosts or mock data
    const saved = localStorage.getItem('tutorPosts');
    let foundJob = null;
    if (saved) {
      const allPosts = JSON.parse(saved);
      const post = allPosts.find((p: any) => p.id === id - 1000);
      if (post) {
        foundJob = {
          id: post.id + 1000,
          title: post.title,
          tutorName: post.authorName || "Gia sư ẩn danh",
          tutorInitials: (post.authorName || "G").charAt(0).toUpperCase(),
          tutorId: 1,
          tutorRating: 5.0,
          subject: post.subject,
          price: post.price,
          format: post.format,
          schedule: "Thỏa thuận",
          description: post.desc || "Chi tiết khóa học đang được cập nhật...",
          interested: post.applicants || 0,
          classType: post.classType || '1-on-1',
          maxStudents: post.maxStudents || 1,
          registeredStudents: post.registeredStudents || 0,
          postedAt: "Mới đây",
          color: "var(--primary)"
        };
      }
    }
    
    // If not found in localStorage, check mock (for demo)
    if (!foundJob) {
      const MOCK_TUTOR_JOBS = [
        {
          id: 1,
          title: "Lớp Luyện thi IELTS 6.5+ cấp tốc (Kèm 1-1)",
          isNew: true,
          tutorName: "Trần Thị B",
          tutorInitials: "T",
          tutorId: 2,
          tutorRating: 5.0,
          subject: "Tiếng Anh",
          price: "300.000đ/buổi",
          format: "Online",
          schedule: "Thỏa thuận",
          description: "Lộ trình thiết kế riêng biệt cho từng bạn. Cam kết tăng 1.0 band sau 2 tháng. Đã có kinh nghiệm kèm 5 bạn đạt target. Hỗ trợ chấm bài Writing 24/7.",
          interested: 2,
          classType: '1-on-1',
          postedAt: "2 giờ trước",
          color: "var(--accent)"
        },
        {
          id: 2,
          title: "Toán lớp 9 ôn thi vào 10 chuyên",
          isNew: false,
          tutorName: "Nguyễn Văn A",
          tutorInitials: "N",
          tutorId: 1,
          tutorRating: 4.9,
          subject: "Toán học",
          price: "200.000đ/buổi",
          format: "Offline (Tại nhà học sinh)",
          schedule: "Thứ 3, Thứ 5 (19h-21h)",
          description: "Nhận kèm báo bài môn Toán lớp 9, đặc biệt luyện thi chuyên Toán các trường Năng Khiếu, Lê Hồng Phong. Phương pháp dễ hiểu, đi sâu vào bản chất.",
          interested: 5,
          classType: '1-on-1',
          postedAt: "1 ngày trước",
          color: "var(--primary)"
        },
        {
          id: 3,
          title: "Khóa học Guitar đệm hát cơ bản 8 buổi",
          isNew: true,
          tutorName: "Lê Minh C",
          tutorInitials: "L",
          tutorId: 3,
          tutorRating: 4.8,
          subject: "Năng khiếu",
          price: "150.000đ/buổi",
          format: "Offline (Tại nhà gia sư)",
          schedule: "Cuối tuần (Sáng T7, CN)",
          description: "Cam kết đánh được đệm hát cơ bản sau 8 buổi. Dạy cách bắt nhịp, làm quen hợp âm. Môi trường trẻ trung, vui vẻ. Đã có sẵn đàn cho các bạn chưa mua.",
          interested: 12,
          classType: 'group',
          maxStudents: 5,
          registeredStudents: 2,
          postedAt: "3 giờ trước",
          color: "#3B82F6"
        }
      ];
      foundJob = MOCK_TUTOR_JOBS.find(j => j.id === id);
    }
    
    setJob(foundJob);
  }, [id]);

  const handleRegister = () => {
    if (!job) return;
    
    if (job.classType === 'group' && job.registeredStudents >= job.maxStudents) {
      alert("Lớp học này đã đủ số lượng học viên!");
      return;
    }

    if (job.id >= 1000) {
      const realId = job.id - 1000;
      const saved = localStorage.getItem('tutorPosts');
      if (saved) {
        let allPosts = JSON.parse(saved);
        allPosts = allPosts.map((p: any) => {
          if (p.id === realId) {
            if (p.classType === 'group') {
              return { ...p, registeredStudents: (p.registeredStudents || 0) + 1 };
            } else {
              return { ...p, applicants: (p.applicants || 0) + 1 };
            }
          }
          return p;
        });
        localStorage.setItem('tutorPosts', JSON.stringify(allPosts));
      }
    }
    
    alert("Đăng ký thành công! Yêu cầu của bạn đã được ghi nhận.");
    router.push('/students/jobs');
  };

  if (!job) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Đang tải dữ liệu...</div>;

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

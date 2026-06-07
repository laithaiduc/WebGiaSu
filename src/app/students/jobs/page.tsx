"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Users } from 'lucide-react';
import '../../tutors/jobs/jobs.css';
import Link from 'next/link';
import ComboBox from '@/components/common/ComboBox';
import { SUBJECTS, FORMATS } from '@/lib/constants';

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
    postedAt: "3 giờ trước",
    color: "#3B82F6"
  }
];

export default function StudentJobBoard() {
  const [jobs, setJobs] = useState<any[]>(MOCK_TUTOR_JOBS);

  useEffect(() => {
    const saved = localStorage.getItem('tutorPosts');
    if (saved) {
      const allPosts = JSON.parse(saved);
      const approvedPosts = allPosts.filter((p: any) => p.status === 'Đang hiển thị').map((p: any) => ({
        id: p.id + 1000, // avoid collision
        title: p.title,
        isNew: true,
        tutorName: p.authorName || "Gia sư ẩn danh",
        tutorInitials: (p.authorName || "G").charAt(0).toUpperCase(),
        tutorId: 1, // mock
        tutorRating: 5.0,
        subject: p.subject,
        price: p.price,
        format: p.format,
        schedule: "Thỏa thuận",
        description: p.desc || "Chi tiết khóa học đang được cập nhật...",
        interested: p.applicants || 0,
        classType: p.classType || '1-on-1',
        maxStudents: p.maxStudents || 1,
        registeredStudents: p.registeredStudents || 0,
        postedAt: "Mới đây",
        color: "var(--primary)"
      }));
      setJobs([...approvedPosts, ...MOCK_TUTOR_JOBS]);
    }
  }, []);

  return (
    <div className="container jobs-container">
      <div className="page-header" style={{textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem'}}>
        <h1>Bảng tin <span className="text-gradient">Lớp học từ Gia sư</span></h1>
        <p>Khám phá các khóa học, lớp kèm đặc biệt do chính các gia sư uy tín mở ra.</p>
      </div>

      <div className="content-layout">
        <aside className="filters-sidebar glass">
          <h3 className="flex-center" style={{gap: '0.5rem', marginBottom: '1.5rem'}}><Filter size={20} /> Bộ lọc Bảng tin</h3>
          
          <ComboBox label="Môn học" placeholder="Tìm môn học..." options={SUBJECTS} />
          
          <ComboBox label="Hình thức học" placeholder="Tất cả hình thức" options={FORMATS} />
          
          <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>Lọc kết quả</button>
        </aside>

        <main className="results-container">
          <div className="flex-between" style={{marginBottom: '1.5rem'}}>
            <p>Có <strong>{jobs.length}</strong> lớp học đang mở</p>
            <div className="input-with-icon" style={{width: '250px', position: 'relative'}}>
              <Search size={16} className="text-muted" style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)'}} />
              <input type="text" className="input-field" placeholder="Tìm kiếm lớp..." style={{paddingLeft: '2.5rem'}} />
            </div>
          </div>

          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className="card glass job-card">
                <div className="flex-between" style={{marginBottom: '1rem'}}>
                  <div className="flex-center" style={{gap: '0.5rem'}}>
                    {job.isNew && <span className="tag" style={{background: 'rgba(249,115,22,0.1)', color: 'var(--primary)', fontWeight: 'bold'}}>Mới đăng</span>}
                    {job.classType === 'group' ? (
                      <span className="tag" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 'bold'}}>Lớp Nhóm</span>
                    ) : (
                      <span className="tag" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', fontWeight: 'bold'}}>Kèm 1-1</span>
                    )}
                  </div>
                  <span className="text-muted flex-center" style={{gap: '0.5rem'}}><Clock size={16}/> {job.postedAt}</span>
                </div>
                
                <h2 style={{fontSize: '1.3rem', color: '#D94625', marginBottom: '0.5rem'}}>{job.title}</h2>
                <div className="flex-center" style={{gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1rem', flexWrap: 'wrap'}}>
                  <span>Đăng bởi Gia sư:</span>
                  <Link href={`/tutors/${job.tutorId}`} className="flex-center" style={{gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none'}}>
                    <div style={{width: '24px', height: '24px', borderRadius: '50%', background: job.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem'}}>{job.tutorInitials}</div>
                    {job.tutorName}
                  </Link>
                  <span className="flex-center" style={{gap: '0.25rem', color: '#F59E0B', marginLeft: '0.5rem'}}><Star size={14} fill="currentColor"/> {job.tutorRating.toFixed(1)}</span>
                </div>
                
                <div className="job-details" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-sm)'}}>
                  <div><strong className="text-muted">Môn học:</strong> {job.subject}</div>
                  <div><strong className="text-muted">Học phí:</strong> {job.price}</div>
                  <div><strong className="text-muted">Hình thức:</strong> {job.format}</div>
                  <div><strong className="text-muted">Lịch học:</strong> {job.schedule}</div>
                </div>
                
                <p style={{marginBottom: '1.5rem', lineHeight: 1.6, color: 'var(--text-muted)'}}>
                  {job.description}
                </p>
                
                <div className="flex-between" style={{borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
                  {job.classType === 'group' ? (
                    <span className="text-muted flex-center" style={{gap: '0.5rem'}}><Users size={18}/> Đã đăng ký: <strong style={{color: 'var(--text-main)'}}>{job.registeredStudents}/{job.maxStudents}</strong></span>
                  ) : (
                    <span className="text-muted flex-center" style={{gap: '0.5rem'}}><Users size={18}/> {job.interested || 0} bạn đã quan tâm</span>
                  )}
                  <Link href={`/students/jobs/${job.id}`} className="btn btn-primary" style={{padding: '0.6rem 1.5rem', textDecoration: 'none'}}>
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

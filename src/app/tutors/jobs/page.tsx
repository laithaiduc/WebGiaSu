"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Briefcase, Clock, Send, ChevronDown } from 'lucide-react';
import './jobs.css';

import ComboBox from '@/components/common/ComboBox';
import { SUBJECTS, FORMATS } from '@/lib/constants';

const GRADES = ["Mầm non", "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12", "Đại học", "Người đi làm"];

const MOCK_JOBS = [
  {
    id: 1,
    title: "Tìm gia sư Tiếng Anh giao tiếp cho người đi làm",
    isNew: true,
    subject: "Tiếng Anh",
    format: "Học Online",
    time: "2 buổi/tuần (Tối)",
    price: "250.000đ/buổi",
    reqs: "Mình là người đi làm cần cải thiện kỹ năng giao tiếp tiếng Anh cơ bản. Yêu cầu gia sư phát âm chuẩn, có kinh nghiệm dạy cho người lớn, phương pháp vui vẻ không gò bó.",
    authorName: "Trần Thị Học Sinh",
    authorId: 1,
    postedAt: "2 giờ trước"
  },
  {
    id: 2,
    title: "Tìm gia sư Toán lớp 10 luyện thi",
    isNew: false,
    subject: "Toán học",
    format: "Offline (Quận 3, TP.HCM)",
    time: "3 buổi/tuần",
    price: "200.000đ/buổi",
    reqs: "Học sinh nam lớp 10, học lực khá. Cần gia sư là sinh viên các trường kỹ thuật (Bách Khoa, KHTN) để luyện thi chuyên sâu. Yêu cầu nhiệt tình, nghiêm khắc.",
    authorName: "Phụ huynh bé Nam",
    authorId: 2,
    postedAt: "1 ngày trước"
  },
  {
    id: 3,
    title: "Gia sư Tiếng Nhật N4 cấp tốc",
    isNew: true,
    subject: "Tiếng Nhật",
    format: "Học Online",
    time: "4 buổi/tuần",
    price: "300.000đ/buổi",
    reqs: "Cần tìm giáo viên hoặc sinh viên năm cuối khoa Tiếng Nhật hỗ trợ luyện thi N4 cấp tốc trong 2 tháng tới. Ưu tiên người đã từng sống/làm việc tại Nhật.",
    authorName: "Nguyễn Hải",
    authorId: 3,
    postedAt: "3 giờ trước"
  },
  {
    id: 4,
    title: "Tìm cô giáo dạy đàn Piano cơ bản cho bé 6 tuổi",
    isNew: false,
    subject: "Năng khiếu (Piano)",
    format: "Offline (Quận 7, TP.HCM)",
    time: "2 buổi/tuần (Cuối tuần)",
    price: "350.000đ/buổi",
    reqs: "Nhà đã có sẵn đàn. Bé 6 tuổi chưa biết gì về nhạc lý. Cần cô giáo yêu trẻ, nhẹ nhàng, biết cách khơi gợi sự hứng thú cho bé.",
    authorName: "Chị Mai",
    authorId: 4,
    postedAt: "2 ngày trước"
  },
  {
    id: 5,
    title: "Ôn tập Vật Lý lớp 12 chuẩn bị thi THPT Quốc gia",
    isNew: false,
    subject: "Vật lý",
    format: "Học Online",
    time: "3 buổi/tuần",
    price: "250.000đ/buổi",
    reqs: "Mục tiêu 8+ Lý Đại học. Em bị hổng kiến thức phần Dao động cơ và Sóng. Cần thầy/cô hoặc gia sư có điểm thi Lý cao hướng dẫn giải nhanh trắc nghiệm.",
    authorName: "Hoàng Minh",
    authorId: 5,
    postedAt: "3 ngày trước"
  }
];

export default function JobBoard() {
  const [jobs, setJobs] = useState<any[]>(MOCK_JOBS);

  useEffect(() => {
    const saved = localStorage.getItem('studentPosts');
    if (saved) {
      const allPosts = JSON.parse(saved);
      const approvedPosts = allPosts.filter((p: any) => p.status === 'Đang tìm gia sư').map((p: any) => ({
        id: p.id,
        title: p.title,
        isNew: true,
        subject: p.subject,
        format: p.format,
        time: p.time,
        price: p.price,
        reqs: p.reqs || "Không có yêu cầu thêm.",
        authorName: p.authorName || "Học sinh ẩn danh",
        authorId: 1,
        postedAt: "Mới đây"
      }));
      setJobs([...approvedPosts, ...MOCK_JOBS]);
    }
  }, []);

  return (
    <div className="container job-board-container">
      <div className="page-header" style={{textAlign: 'center', marginBottom: '3rem'}}>
        <h1>Bảng tin <span className="text-gradient">Lớp học</span></h1>
        <p>Hàng trăm lớp học mới được cập nhật mỗi ngày. Ứng tuyển ngay!</p>
      </div>

      <div className="content-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass" style={{borderRadius: '1.5rem', border: '1px solid rgba(249, 115, 22, 0.1)', boxShadow: '0 10px 30px -5px rgba(249, 115, 22, 0.1)'}}>
          <div className="flex-between" style={{marginBottom: '1.5rem'}}>
            <h3 className="flex-center" style={{gap: '0.5rem'}}><Filter size={20} /> Bộ lọc Lớp</h3>
            <button className="text-primary" style={{background:'none', border:'none', cursor:'pointer', fontWeight: 'bold'}}>Xóa lọc</button>
          </div>
          
          <ComboBox options={SUBJECTS} placeholder="Ví dụ: Toán, Lý..." label="Môn học (Gõ để tìm)" />
          <ComboBox options={GRADES} placeholder="Ví dụ: Lớp 10..." label="Lớp (Gõ để tìm)" />
          <ComboBox options={FORMATS} placeholder="Ví dụ: Online..." label="Hình thức học (Gõ để tìm)" />
          
          <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>Lọc kết quả</button>
        </aside>

        {/* Jobs List */}
        <main className="results-container">
          <div className="flex-between" style={{marginBottom: '1.5rem'}}>
            <p>Đang hiển thị <strong>{jobs.length}</strong> lớp học phù hợp</p>
            <select className="input-field" style={{width: 'auto'}}>
              <option>Mới đăng nhất</option>
              <option>Học phí cao nhất</option>
            </select>
          </div>

          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card glass">
                <div className="flex-between">
                  <h2 style={{color: '#D94625', fontSize: '1.4rem'}}>{job.title}</h2>
                  {job.isNew && <span className="tag" style={{background: 'transparent', border: '1px solid var(--border)'}}>Mới</span>}
                </div>
                
                <div className="job-info-grid">
                  <div className="info-item flex-center"><Briefcase size={16} /> <strong>Môn:</strong> {job.subject}</div>
                  <div className="info-item flex-center"><MapPin size={16} /> <strong>Hình thức:</strong> {job.format}</div>
                  <div className="info-item flex-center"><Clock size={16} /> <strong>Thời gian:</strong> {job.time}</div>
                  <div className="info-item flex-center" style={{color: 'var(--primary)', fontWeight: 'bold'}}>{job.price}</div>
                </div>
                
                <p className="job-description">
                  <strong>Yêu cầu:</strong> {job.reqs}
                </p>
                
                <div className="job-footer flex-between">
                  <span className="text-muted" style={{fontSize: '0.85rem'}}>Đăng bởi: <Link href={`/students/${job.authorId}`} style={{fontWeight: 600, color: 'var(--primary)', textDecoration: 'none'}}>{job.authorName}</Link> - {job.postedAt}</span>
                  <Link href={`/students/${job.authorId}`} className="btn btn-primary flex-center" style={{gap: '0.5rem', textDecoration: 'none'}}>Xem chi tiết</Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

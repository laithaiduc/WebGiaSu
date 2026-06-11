"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, MapPin, Briefcase, Clock } from 'lucide-react';
import './jobs.css';
import ComboBox from '@/components/common/ComboBox';
import { SUBJECTS, FORMATS, GRADES } from '@/lib/constants';
import { fetchPosts } from '@/lib/api';

type JobItem = {
  id: number;
  jobKey: string;
  title: string;
  isNew: boolean;
  subject: string;
  grade: string;
  format: string;
  time: string;
  price: string;
  reqs: string;
  authorName: string;
  authorId: number;
  postedAt: string;
};

export default function JobBoard() {
  const [allJobs, setAllJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [sortBy, setSortBy] = useState("Mới đăng nhất");
  const [appliedFilters, setAppliedFilters] = useState({ subject: "", grade: "", format: "" });

  useEffect(() => {
    const loadStudentJobs = async () => {
      setLoading(true);
      try {
        const res = await fetchPosts('student');
        const approved = (res.data || [])
          .filter((p: any) => p.status === 'Đang tìm gia sư')
          .map((p: any) => ({
            id: p.id,
            jobKey: `student-${p.id}`,
            title: p.title,
            isNew: true,
            subject: p.subject || '',
            grade: p.grade || 'Khác',
            format: p.format || '',
            time: p.time || '',
            price: p.price || '',
            reqs: p.description || 'Không có yêu cầu thêm.',
            authorName: p.author_name || 'Học sinh ẩn danh',
            authorId: p.author_id,
            postedAt: p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : 'Mới đây',
          }));
        setAllJobs(approved);
      } catch (err) {
        console.error('Failed to load student posts', err);
        setAllJobs([]);
      } finally {
        setLoading(false);
      }
    };
    loadStudentJobs();
  }, []);

  const handleApply = () => {
    setAppliedFilters({ subject: selectedSubject, grade: selectedGrade, format: selectedFormat });
  };

  const handleReset = () => {
    setSelectedSubject("");
    setSelectedGrade("");
    setSelectedFormat("");
    setAppliedFilters({ subject: "", grade: "", format: "" });
  };

  let filteredJobs = allJobs.filter((job) => {
    const subjectMatch = !appliedFilters.subject ||
      job.subject.toLowerCase().includes(appliedFilters.subject.toLowerCase()) ||
      job.title.toLowerCase().includes(appliedFilters.subject.toLowerCase());
    const gradeMatch = !appliedFilters.grade ||
      job.grade.toLowerCase().includes(appliedFilters.grade.toLowerCase()) ||
      job.title.toLowerCase().includes(appliedFilters.grade.toLowerCase());
    const formatMatch = !appliedFilters.format ||
      job.format.toLowerCase().includes(appliedFilters.format.toLowerCase());
    return subjectMatch && gradeMatch && formatMatch;
  });

  if (sortBy === "Học phí cao nhất") {
    filteredJobs = [...filteredJobs].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
      const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
      return priceB - priceA;
    });
  } else {
    filteredJobs = [...filteredJobs].sort((a, b) => b.id - a.id);
  }

  return (
    <div className="container job-board-container">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Bảng tin <span className="text-gradient">Lớp học</span></h1>
        <p>Hàng trăm lớp học mới được cập nhật mỗi ngày. Ứng tuyển ngay!</p>
      </div>

      <div className="content-layout">
        <aside className="filters-sidebar glass" style={{ borderRadius: '1.5rem', border: '1px solid rgba(249, 115, 22, 0.1)', boxShadow: '0 10px 30px -5px rgba(249, 115, 22, 0.1)' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 className="flex-center" style={{ gap: '0.5rem' }}><Filter size={20} /> Bộ lọc Lớp</h3>
            <button className="text-primary" onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Xóa lọc</button>
          </div>
          <ComboBox options={SUBJECTS} placeholder="Ví dụ: Toán, Lý..." label="Môn học (Gõ để tìm)" value={selectedSubject} onChange={setSelectedSubject} />
          <ComboBox options={GRADES} placeholder="Ví dụ: Lớp 10..." label="Lớp (Gõ để tìm)" value={selectedGrade} onChange={setSelectedGrade} />
          <ComboBox options={FORMATS} placeholder="Ví dụ: Online..." label="Hình thức học (Gõ để tìm)" value={selectedFormat} onChange={setSelectedFormat} />
          <button className="btn btn-primary" onClick={handleApply} style={{ width: '100%', marginTop: '1rem' }}>Lọc kết quả</button>
        </aside>

        <main className="results-container">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <p>Đang hiển thị <strong>{filteredJobs.length}</strong> lớp học phù hợp</p>
            <select className="input-field" style={{ width: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Mới đăng nhất</option>
              <option>Học phí cao nhất</option>
            </select>
          </div>

          <div className="jobs-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Đang tải...</div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p>Không tìm thấy lớp học nào phù hợp với bộ lọc.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.jobKey} className="job-card glass">
                  <div className="flex-between">
                    <h2 style={{ color: '#D94625', fontSize: '1.4rem' }}>{job.title}</h2>
                    {job.isNew && <span className="tag" style={{ background: 'transparent', border: '1px solid var(--border)' }}>Mới</span>}
                  </div>
                  <div className="job-info-grid">
                    <div className="info-item flex-center"><Briefcase size={16} /> <strong>Môn:</strong> {job.subject}</div>
                    <div className="info-item flex-center"><MapPin size={16} /> <strong>Hình thức:</strong> {job.format}</div>
                    <div className="info-item flex-center"><Clock size={16} /> <strong>Thời gian:</strong> {job.time}</div>
                    <div className="info-item flex-center" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{job.price}</div>
                  </div>
                  <p className="job-description"><strong>Yêu cầu:</strong> {job.reqs}</p>
                  <div className="job-footer flex-between">
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      Đăng bởi: <Link href={`/students/${job.authorId}`} style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>{job.authorName}</Link> - {job.postedAt}
                    </span>
                    <Link href={`/students/${job.authorId}`} className="btn btn-primary flex-center" style={{ gap: '0.5rem', textDecoration: 'none' }}>Xem chi tiết</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

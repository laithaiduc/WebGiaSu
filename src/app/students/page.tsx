"use client";

import { Search, Filter, Star, MapPin, ChevronDown } from 'lucide-react';
import './students.css';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import ComboBox from '@/components/common/ComboBox';
import { SUBJECTS, GRADES } from '@/lib/constants';

const MOCK_TUTORS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    initials: "N",
    color: "var(--primary)",
    location: "Quận 1, TP.HCM",
    rating: 4.9,
    tags: ["Toán học", "Vật lý", "Lớp 10", "Lớp 11", "Lớp 12"],
    bio: "Sinh viên năm 3 Đại học Bách Khoa, có 2 năm kinh nghiệm gia sư môn Toán, Lý. Phương pháp dạy trực quan, cam kết điểm 8+.",
    price: "150.000đ"
  },
  {
    id: 2,
    name: "Trần Thị B",
    initials: "T",
    color: "var(--accent)",
    location: "Cầu Giấy, Hà Nội",
    rating: 5.0,
    tags: ["Tiếng Anh", "Luyện thi IELTS", "Người đi làm"],
    bio: "Giáo viên tự do, 8.0 IELTS. Có phương pháp dạy sáng tạo, giúp học viên mất gốc lấy lại căn bản nhanh chóng trong 3 tháng.",
    price: "200.000đ"
  },
  {
    id: 3,
    name: "Lê Hoàng C",
    initials: "L",
    color: "#3B82F6",
    location: "Quận 3, TP.HCM",
    rating: 4.8,
    tags: ["Ngữ văn", "Lịch sử", "Lớp 9", "Luyện thi Đại học"],
    bio: "Thạc sĩ chuyên ngành Ngữ Văn Đại học Sư Phạm. Dạy học bằng sơ đồ tư duy, giúp học sinh ghi nhớ tự nhiên không học vẹt.",
    price: "300.000đ"
  },
  {
    id: 4,
    name: "Phạm Đăng D",
    initials: "P",
    color: "#8B5CF6",
    location: "Thủ Đức, TP.HCM",
    rating: 4.7,
    tags: ["Lập trình", "Tin học", "Đại học"],
    bio: "Kỹ sư phần mềm đang làm việc tại tập đoàn đa quốc gia. Nhận dạy kèm lập trình web (HTML/CSS/JS, React) cho sinh viên.",
    price: "400.000đ"
  },
  {
    id: 5,
    name: "Vũ Minh E",
    initials: "V",
    color: "#10B981",
    location: "Hải Châu, Đà Nẵng",
    rating: 4.9,
    tags: ["Hóa học", "Sinh học", "Lớp 8", "Lớp 9"],
    bio: "Giáo viên trường THPT chuyên Lê Quý Đôn. Có kinh nghiệm luyện thi học sinh giỏi, phương pháp sư phạm cực kỳ thu hút.",
    price: "250.000đ"
  },
  {
    id: 6,
    name: "Đỗ Thùy F",
    initials: "Đ",
    color: "#EC4899",
    location: "Ba Đình, Hà Nội",
    rating: 5.0,
    tags: ["Năng khiếu", "Piano", "Mầm non", "Lớp 1"],
    bio: "Sinh viên Học viện Âm nhạc Quốc gia. Yêu trẻ con, kiên nhẫn, chuyên dạy đàn Piano từ cơ bản cho các bé nhỏ.",
    price: "350.000đ"
  }
];

export default function FindTutor() {
  const [minPrice, setMinPrice] = useState("50000");
  const [maxPrice, setMaxPrice] = useState("500000");
  const [tutors, setTutors] = useState<any[]>(MOCK_TUTORS);

  // In a real app, this would load Registered Tutor Profiles, not Tutor Posts.
  // For now, we just show MOCK_TUTORS here.

  return (
    <div className="container find-tutor-container">
      <div className="page-header">
        <h1>Tìm kiếm <span className="text-gradient">Gia sư</span></h1>
        <p>Hàng ngàn gia sư chất lượng đang chờ đón bạn.</p>
      </div>

      <div className="content-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass card">
          <div className="flex-between" style={{marginBottom: '1.5rem'}}>
            <h3 className="flex-center" style={{gap: '0.5rem'}}><Filter size={20} /> Bộ lọc</h3>
            <button className="text-primary" style={{background:'none', border:'none', cursor:'pointer', fontWeight: 'bold'}}>Xóa lọc</button>
          </div>

          <ComboBox options={SUBJECTS} placeholder="Ví dụ: Toán, Lý..." label="Môn học (Gõ để tìm)" />
          <ComboBox options={GRADES} placeholder="Ví dụ: Lớp 10..." label="Lớp (Gõ để tìm)" />

          <div className="filter-group">
            <label>Khoảng giá (VNĐ/giờ)</label>
            <div className="flex-between" style={{gap: '0.5rem'}}>
              <input 
                type="number" 
                className="input-field" 
                placeholder="Từ" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)}
                style={{padding: '0.5rem', flex: 1, minWidth: 0}} 
              />
              <span style={{fontWeight: 'bold', color: 'var(--text-muted)'}}>-</span>
              <input 
                type="number" 
                className="input-field" 
                placeholder="Đến" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{padding: '0.5rem', flex: 1, minWidth: 0}} 
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Giọng nói vùng miền</label>
            <select className="input-field" style={{cursor: 'pointer'}}>
              <option>Bất kỳ</option>
              <option>Miền Bắc</option>
              <option>Miền Trung</option>
              <option>Miền Nam</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Giới tính</label>
            <div className="flex-center" style={{gap: '1rem', justifyContent: 'flex-start'}}>
              <label className="flex-center" style={{gap: '0.5rem', cursor:'pointer'}}>
                <input type="radio" name="gender" style={{accentColor:'var(--primary)', width: '18px', height: '18px'}}/> Nam
              </label>
              <label className="flex-center" style={{gap: '0.5rem', cursor:'pointer'}}>
                <input type="radio" name="gender" style={{accentColor:'var(--primary)', width: '18px', height: '18px'}}/> Nữ
              </label>
            </div>
          </div>
          
          <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>Áp dụng</button>
        </aside>

        {/* Results */}
        <main className="results-container">
          <div className="results-header flex-between">
            <p>Tìm thấy <strong>{tutors.length}</strong> gia sư phù hợp</p>
            <select className="input-field" style={{width: 'auto', cursor: 'pointer'}}>
              <option>Mới nhất</option>
              <option>Đánh giá cao nhất</option>
              <option>Giá thấp nhất</option>
            </select>
          </div>

          <div className="tutor-grid">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="card tutor-card">
                <div className="tutor-header flex-between">
                  <div className="tutor-info flex-center" style={{gap: '1rem'}}>
                    <div className="tutor-avatar" style={{background: tutor.color}}>{tutor.initials}</div>
                    <div>
                      <h3 style={{fontSize: '1.25rem', color: '#D94625'}}>{tutor.name}</h3>
                      <p className="text-muted flex-center" style={{justifyContent: 'flex-start', gap: '0.25rem', fontSize: '0.875rem'}}>
                        <MapPin size={14} /> {tutor.location}
                      </p>
                    </div>
                  </div>
                  <div className="tutor-rating flex-center" style={{gap: '0.25rem', color: '#F59E0B', fontWeight: 'bold'}}>
                    <Star size={18} fill="currentColor" /> {tutor.rating.toFixed(1)}
                  </div>
                </div>
                
                <div className="tutor-tags">
                  {tutor.tags.map((tag: string) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                
                <p className="tutor-bio">{tutor.bio}</p>
                
                <div className="tutor-footer flex-between">
                  <div className="tutor-price" style={{color: 'var(--primary)', fontWeight: 'bold'}}>{tutor.price}<span style={{fontSize:'0.85rem', color:'var(--text-muted)', fontWeight:'normal'}}>/giờ</span></div>
                  <Link href={`/tutors/${tutor.id}`} className="btn btn-primary" style={{padding: '0.5rem 1rem', textDecoration: 'none'}}>Xem chi tiết</Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

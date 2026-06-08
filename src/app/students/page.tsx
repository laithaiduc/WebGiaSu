"use client";

import { Filter, Star, MapPin } from 'lucide-react';
import './students.css';
import { useState } from 'react';
import Link from 'next/link';

import ComboBox from '@/components/common/ComboBox';
import { SUBJECTS, GRADES } from '@/lib/constants';

// Vùng miền mapping dựa theo địa điểm
const REGION_MAP: Record<string, string> = {
  "TP.HCM": "Miền Nam",
  "Hà Nội": "Miền Bắc",
  "Đà Nẵng": "Miền Trung",
};

const MOCK_TUTORS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    gender: "Nam",
    initials: "N",
    color: "var(--primary)",
    location: "Quận 1, TP.HCM",
    region: "Miền Nam",
    rating: 4.9,
    priceNumber: 150000,
    tags: ["Toán học", "Vật lý", "Lớp 10", "Lớp 11", "Lớp 12"],
    bio: "Sinh viên năm 3 Đại học Bách Khoa, có 2 năm kinh nghiệm gia sư môn Toán, Lý. Phương pháp dạy trực quan, cam kết điểm 8+.",
    price: "150.000đ"
  },
  {
    id: 2,
    name: "Trần Thị B",
    gender: "Nữ",
    initials: "T",
    color: "var(--accent)",
    location: "Cầu Giấy, Hà Nội",
    region: "Miền Bắc",
    rating: 5.0,
    priceNumber: 200000,
    tags: ["Tiếng Anh", "Luyện thi IELTS", "Người đi làm"],
    bio: "Giáo viên tự do, 8.0 IELTS. Có phương pháp dạy sáng tạo, giúp học viên mất gốc lấy lại căn bản nhanh chóng trong 3 tháng.",
    price: "200.000đ"
  },
  {
    id: 3,
    name: "Lê Hoàng C",
    gender: "Nam",
    initials: "L",
    color: "#3B82F6",
    location: "Quận 3, TP.HCM",
    region: "Miền Nam",
    rating: 4.8,
    priceNumber: 300000,
    tags: ["Ngữ văn", "Lịch sử", "Lớp 9", "Luyện thi Đại học"],
    bio: "Thạc sĩ chuyên ngành Ngữ Văn Đại học Sư Phạm. Dạy học bằng sơ đồ tư duy, giúp học sinh ghi nhớ tự nhiên không học vẹt.",
    price: "300.000đ"
  },
  {
    id: 4,
    name: "Phạm Đăng D",
    gender: "Nam",
    initials: "P",
    color: "#8B5CF6",
    location: "Thủ Đức, TP.HCM",
    region: "Miền Nam",
    rating: 4.7,
    priceNumber: 400000,
    tags: ["Lập trình", "Tin học", "Đại học"],
    bio: "Kỹ sư phần mềm đang làm việc tại tập đoàn đa quốc gia. Nhận dạy kèm lập trình web (HTML/CSS/JS, React) cho sinh viên.",
    price: "400.000đ"
  },
  {
    id: 5,
    name: "Vũ Minh E",
    gender: "Nam",
    initials: "V",
    color: "#10B981",
    location: "Hải Châu, Đà Nẵng",
    region: "Miền Trung",
    rating: 4.9,
    priceNumber: 250000,
    tags: ["Hóa học", "Sinh học", "Lớp 8", "Lớp 9"],
    bio: "Giáo viên trường THPT chuyên Lê Quý Đôn. Có kinh nghiệm luyện thi học sinh giỏi, phương pháp sư phạm cực kỳ thu hút.",
    price: "250.000đ"
  },
  {
    id: 6,
    name: "Đỗ Thùy F",
    gender: "Nữ",
    initials: "Đ",
    color: "#EC4899",
    location: "Ba Đình, Hà Nội",
    region: "Miền Bắc",
    rating: 5.0,
    priceNumber: 350000,
    tags: ["Năng khiếu", "Piano", "Mầm non", "Lớp 1"],
    bio: "Sinh viên Học viện Âm nhạc Quốc gia. Yêu trẻ con, kiên nhẫn, chuyên dạy đàn Piano từ cơ bản cho các bé nhỏ.",
    price: "350.000đ"
  }
];

export default function FindTutor() {
  // Filter states
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [minPrice, setMinPrice] = useState("50000");
  const [maxPrice, setMaxPrice] = useState("500000");
  const [selectedRegion, setSelectedRegion] = useState("Bất kỳ");
  const [selectedGender, setSelectedGender] = useState("");
  const [sortBy, setSortBy] = useState("Mới nhất");

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState({
    subject: "",
    grade: "",
    minPrice: 50000,
    maxPrice: 500000,
    region: "Bất kỳ",
    gender: "",
  });

  const handleApply = () => {
    setAppliedFilters({
      subject: selectedSubject,
      grade: selectedGrade,
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || 999999999,
      region: selectedRegion,
      gender: selectedGender,
    });
  };

  const handleReset = () => {
    setSelectedSubject("");
    setSelectedGrade("");
    setMinPrice("50000");
    setMaxPrice("500000");
    setSelectedRegion("Bất kỳ");
    setSelectedGender("");
    setAppliedFilters({
      subject: "",
      grade: "",
      minPrice: 50000,
      maxPrice: 500000,
      region: "Bất kỳ",
      gender: "",
    });
  };

  // Filtering logic
  let filteredTutors = MOCK_TUTORS.filter((tutor) => {
    const minP = appliedFilters.minPrice;
    const maxP = appliedFilters.maxPrice;

    const subjectMatch = !appliedFilters.subject ||
      tutor.tags.some(tag => tag.toLowerCase().includes(appliedFilters.subject.toLowerCase()));

    const gradeMatch = !appliedFilters.grade ||
      tutor.tags.some(tag => tag.toLowerCase().includes(appliedFilters.grade.toLowerCase()));

    const priceMatch = tutor.priceNumber >= minP && tutor.priceNumber <= maxP;

    const regionMatch = appliedFilters.region === "Bất kỳ" ||
      tutor.region === appliedFilters.region;

    const genderMatch = !appliedFilters.gender || tutor.gender === appliedFilters.gender;

    return subjectMatch && gradeMatch && priceMatch && regionMatch && genderMatch;
  });

  // Sorting
  if (sortBy === "Đánh giá cao nhất") {
    filteredTutors = [...filteredTutors].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "Giá thấp nhất") {
    filteredTutors = [...filteredTutors].sort((a, b) => a.priceNumber - b.priceNumber);
  }

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
            <button
              className="text-primary"
              style={{background:'none', border:'none', cursor:'pointer', fontWeight: 'bold'}}
              onClick={handleReset}
            >
              Xóa lọc
            </button>
          </div>

          <ComboBox
            options={SUBJECTS}
            placeholder="Ví dụ: Toán, Lý..."
            label="Môn học (Gõ để tìm)"
            value={selectedSubject}
            onChange={setSelectedSubject}
          />
          <ComboBox
            options={GRADES}
            placeholder="Ví dụ: Lớp 10..."
            label="Lớp (Gõ để tìm)"
            value={selectedGrade}
            onChange={setSelectedGrade}
          />

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
            <select
              className="input-field"
              style={{cursor: 'pointer'}}
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
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
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={selectedGender === "Nam"}
                  onChange={() => setSelectedGender("Nam")}
                  style={{accentColor:'var(--primary)', width: '18px', height: '18px'}}
                /> Nam
              </label>
              <label className="flex-center" style={{gap: '0.5rem', cursor:'pointer'}}>
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={selectedGender === "Nữ"}
                  onChange={() => setSelectedGender("Nữ")}
                  style={{accentColor:'var(--primary)', width: '18px', height: '18px'}}
                /> Nữ
              </label>
              {selectedGender && (
                <button
                  style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'0.8rem', textDecoration:'underline'}}
                  onClick={() => setSelectedGender("")}
                >
                  Bỏ chọn
                </button>
              )}
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{width: '100%', marginTop: '1rem'}}
            onClick={handleApply}
          >
            Áp dụng
          </button>
        </aside>

        {/* Results */}
        <main className="results-container">
          <div className="results-header flex-between">
            <p>Tìm thấy <strong>{filteredTutors.length}</strong> gia sư phù hợp</p>
            <select
              className="input-field"
              style={{width: 'auto', cursor: 'pointer'}}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Mới nhất</option>
              <option>Đánh giá cao nhất</option>
              <option>Giá thấp nhất</option>
            </select>
          </div>

          {filteredTutors.length === 0 ? (
            <div style={{textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)'}}>
              <Filter size={48} style={{margin: '0 auto 1rem', opacity: 0.3}} />
              <h3 style={{marginBottom: '0.5rem', color: 'var(--text-main)'}}>Không tìm thấy gia sư phù hợp</h3>
              <p>Thử điều chỉnh bộ lọc hoặc <button style={{background:'none', border:'none', color:'var(--primary)', cursor:'pointer', fontWeight:'bold', textDecoration:'underline'}} onClick={handleReset}>xóa lọc</button> để xem tất cả.</p>
            </div>
          ) : (
            <div className="tutor-grid">
              {filteredTutors.map((tutor) => (
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
          )}
        </main>
      </div>
    </div>
  );
}

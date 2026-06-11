"use client";

import { Filter, Star, MapPin } from 'lucide-react';
import './students.css';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ComboBox from '@/components/common/ComboBox';
import { SUBJECTS, GRADES } from '@/lib/constants';
import { fetchTutors } from '@/lib/api';
import type { TutorProfile } from '@/lib/types';

const AVATAR_COLORS = ['var(--primary)', 'var(--accent)', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899'];

function formatPrice(price: number) {
  if (!price) return 'Thỏa thuận';
  return `${price.toLocaleString('vi-VN')}đ`;
}

function FindTutorContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';
  const initialGrade = searchParams.get('grade') || '';
  const initialLocation = searchParams.get('location') || '';

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [minPrice, setMinPrice] = useState('50000');
  const [maxPrice, setMaxPrice] = useState('500000');
  const [selectedRegion, setSelectedRegion] = useState('Bất kỳ');
  const [selectedGender, setSelectedGender] = useState('');
  const [location, setLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState('Mới nhất');
  const [appliedFilters, setAppliedFilters] = useState({
    subject: initialSubject,
    grade: initialGrade,
    location: initialLocation,
    minPrice: 50000,
    maxPrice: 500000,
    region: 'Bất kỳ',
    gender: '',
  });

  const loadTutors = async (filters = appliedFilters) => {
    setLoading(true);
    try {
      const res = await fetchTutors({
        subject: filters.subject || undefined,
        grade: filters.grade || undefined,
        location: filters.location || undefined,
        region: filters.region !== 'Bất kỳ' ? filters.region : undefined,
        gender: filters.gender || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
      setTutors(res.data || []);
    } catch (err) {
      console.error('Failed to load tutors', err);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const handleApply = () => {
    const next = {
      subject: selectedSubject,
      grade: selectedGrade,
      location,
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || 999999999,
      region: selectedRegion,
      gender: selectedGender,
    };
    setAppliedFilters(next);
    loadTutors(next);
  };

  const handleReset = () => {
    setSelectedSubject('');
    setSelectedGrade('');
    setLocation('');
    setMinPrice('50000');
    setMaxPrice('500000');
    setSelectedRegion('Bất kỳ');
    setSelectedGender('');
    const next = { subject: '', grade: '', location: '', minPrice: 50000, maxPrice: 500000, region: 'Bất kỳ', gender: '' };
    setAppliedFilters(next);
    loadTutors(next);
  };

  let filteredTutors = [...tutors];
  if (sortBy === 'Đánh giá cao nhất') {
    filteredTutors.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'Giá thấp nhất') {
    filteredTutors.sort((a, b) => (a.price_per_hour || 0) - (b.price_per_hour || 0));
  }

  return (
    <div className="container find-tutor-container">
      <div className="page-header">
        <h1>Tìm kiếm <span className="text-gradient">Gia sư</span></h1>
        <p>Hàng ngàn gia sư chất lượng đang chờ đón bạn.</p>
      </div>

      <div className="content-layout">
        <aside className="filters-sidebar glass card">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 className="flex-center" style={{ gap: '0.5rem' }}><Filter size={20} /> Bộ lọc</h3>
            <button className="text-primary" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleReset}>Xóa lọc</button>
          </div>

          <ComboBox options={SUBJECTS} placeholder="Ví dụ: Toán, Lý..." label="Môn học (Gõ để tìm)" value={selectedSubject} onChange={setSelectedSubject} />
          <ComboBox options={GRADES} placeholder="Ví dụ: Lớp 10..." label="Lớp (Gõ để tìm)" value={selectedGrade} onChange={setSelectedGrade} />

          <div className="filter-group">
            <label>Địa điểm</label>
            <input type="text" className="input-field" placeholder="Ví dụ: TP.HCM" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="filter-group">
            <label>Khoảng giá (VNĐ/giờ)</label>
            <div className="flex-between" style={{ gap: '0.5rem' }}>
              <input type="number" className="input-field" placeholder="Từ" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ padding: '0.5rem', flex: 1, minWidth: 0 }} />
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>-</span>
              <input type="number" className="input-field" placeholder="Đến" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ padding: '0.5rem', flex: 1, minWidth: 0 }} />
            </div>
          </div>

          <div className="filter-group">
            <label>Giọng nói vùng miền</label>
            <select className="input-field" style={{ cursor: 'pointer' }} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              <option>Bất kỳ</option>
              <option>Miền Bắc</option>
              <option>Miền Trung</option>
              <option>Miền Nam</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Giới tính</label>
            <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
              {['Nam', 'Nữ'].map((g) => (
                <label key={g} className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="gender" value={g} checked={selectedGender === g} onChange={() => setSelectedGender(g)} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} /> {g}
                </label>
              ))}
              {selectedGender && (
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'underline' }} onClick={() => setSelectedGender('')}>Bỏ chọn</button>
              )}
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleApply}>Áp dụng</button>
        </aside>

        <main className="results-container">
          <div className="results-header flex-between">
            <p>Tìm thấy <strong>{filteredTutors.length}</strong> gia sư phù hợp</p>
            <select className="input-field" style={{ width: 'auto', cursor: 'pointer' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Mới nhất</option>
              <option>Đánh giá cao nhất</option>
              <option>Giá thấp nhất</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>Đang tải...</div>
          ) : filteredTutors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
              <Filter size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Không tìm thấy gia sư phù hợp</h3>
              <p>Thử điều chỉnh bộ lọc hoặc <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={handleReset}>xóa lọc</button> để xem tất cả.</p>
            </div>
          ) : (
            <div className="tutor-grid">
              {filteredTutors.map((tutor, index) => {
                const tags = [...(tutor.subjects ? tutor.subjects.split(',').map((s) => s.trim()) : []), ...(tutor.grades ? tutor.grades.split(',').map((g) => g.trim()) : [])].filter(Boolean);
                const initials = tutor.name ? tutor.name.charAt(0).toUpperCase() : 'G';
                const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                return (
                  <div key={tutor.id} className="card tutor-card">
                    <div className="tutor-header flex-between">
                      <div className="tutor-info flex-center" style={{ gap: '1rem' }}>
                        {tutor.avatar ? (
                          <img src={tutor.avatar} alt={tutor.name} className="tutor-avatar" style={{ objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          <div className="tutor-avatar" style={{ background: color }}>{initials}</div>
                        )}
                        <div>
                          <h3 style={{ fontSize: '1.25rem', color: '#D94625' }}>{tutor.name}</h3>
                          <p className="text-muted flex-center" style={{ justifyContent: 'flex-start', gap: '0.25rem', fontSize: '0.875rem' }}>
                            <MapPin size={14} /> {tutor.location || 'Chưa cập nhật'}
                          </p>
                        </div>
                      </div>
                      <div className="tutor-rating flex-center" style={{ gap: '0.25rem', color: '#F59E0B', fontWeight: 'bold' }}>
                        <Star size={18} fill="currentColor" /> {(tutor.rating ?? 0).toFixed(1)}
                      </div>
                    </div>
                    <div className="tutor-tags">
                      {tags.slice(0, 5).map((tag) => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <p className="tutor-bio">{tutor.bio || 'Chưa có mô tả.'}</p>
                    <div className="tutor-footer flex-between">
                      <div className="tutor-price" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                        {formatPrice(tutor.price_per_hour)}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/giờ</span>
                      </div>
                      <Link href={`/tutors/${tutor.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Xem chi tiết</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function FindTutor() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Đang tải...</div>}>
      <FindTutorContent />
    </Suspense>
  );
}

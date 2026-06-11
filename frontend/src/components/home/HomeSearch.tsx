"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, MapPin, GraduationCap } from 'lucide-react';
import ComboBox from '@/components/common/ComboBox';
import { SUBJECTS, GRADES } from '@/lib/constants';

export default function HomeSearch() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (grade) params.set('grade', grade);
    if (location) params.set('location', location);
    const qs = params.toString();
    router.push(`/students${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="search-bar-pill">
      <div className="search-divider">
        <BookOpen size={18} className="search-icon" />
        <ComboBox placeholder="Môn học" options={SUBJECTS} className="" inputClassName="search-input" value={subject} onChange={setSubject} />
      </div>
      <div className="search-divider">
        <GraduationCap size={18} className="search-icon" />
        <ComboBox placeholder="Lớp" options={GRADES} className="" inputClassName="search-input" value={grade} onChange={setGrade} />
      </div>
      <div className="search-divider" style={{ border: 'none' }}>
        <MapPin size={18} className="search-icon" />
        <input type="text" placeholder="Địa điểm" className="search-input" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <button type="button" className="btn btn-primary btn-search-submit" onClick={handleSearch}>Tìm Kiếm</button>
    </div>
  );
}

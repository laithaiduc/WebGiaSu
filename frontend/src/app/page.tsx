import { Calculator, FlaskConical, Languages, Palette, Award, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import HomeSearch from '@/components/home/HomeSearch';
import './page.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="bg-decor top-left"></div>
        <div className="bg-decor bottom-right"></div>
        <div className="bg-decor top-right-triangle"></div>
        
        <div className="container hero-layout">
          <div className="hero-text-side">
            <h1 className="hero-title">Tìm Kiếm Gia Sư Phù Hợp</h1>
            
            <HomeSearch />
          </div>
          
          <div className="hero-image-side">
            <div className="hero-illustration">
              <Image 
                src="/study_illustration.png" 
                alt="Study illustration" 
                width={600} 
                height={500} 
                style={{objectFit: 'contain', width: '100%', height: 'auto'}} 
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects-section container">
        <div className="blob-container">
          <h2 className="section-title">Khám Phá Các Môn Học</h2>
          
          <div className="subjects-grid">
            <div className="subject-pill" style={{backgroundColor: '#FFD7B5', color: '#D94625'}}>
              <div className="subject-icon"><Calculator size={24} /></div>
              <span>Toán</span>
            </div>
            <div className="subject-pill" style={{backgroundColor: '#B5E8DF', color: '#0F766E'}}>
              <div className="subject-icon"><FlaskConical size={24} /></div>
              <span>Khoa học</span>
            </div>
            <div className="subject-pill" style={{backgroundColor: '#FFC4C4', color: '#B91C1C'}}>
              <div className="subject-icon"><Languages size={24} /></div>
              <span>Ngữ pháp</span>
            </div>
            <div className="subject-pill" style={{backgroundColor: '#FFD7B5', color: '#D94625'}}>
              <div className="subject-icon"><Palette size={24} /></div>
              <span>Arts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section container">
        <h2 className="section-title" style={{color: '#3F292B', fontSize: '1.75rem', marginTop: '1rem'}}>Lợi ích</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <Award size={28} className="benefit-icon" style={{color: '#D4AF37'}}/>
            <span>Gia sư uy tín</span>
          </div>
          <div className="benefit-item">
            <DollarSign size={28} className="benefit-icon" style={{color: '#F59E0B'}}/>
            <span>Học phí minh bạch</span>
          </div>
          <div className="benefit-item">
            <Calendar size={28} className="benefit-icon" style={{color: '#F87171'}}/>
            <span>Lịch học linh hoạt</span>
          </div>
          <div className="benefit-item">
            <TrendingUp size={28} className="benefit-icon" style={{color: '#34D399'}}/>
            <span>Cam kết kết quả</span>
          </div>
        </div>
      </section>
    </div>
  );
}

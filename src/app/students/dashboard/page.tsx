"use client";

import { useState, useEffect } from 'react';
import { User, Target, MapPin, CheckCircle, Settings, LogOut, FileText, Heart, Star, Phone, Users } from 'lucide-react';
import Link from 'next/link';
import '../../tutors/dashboard/tutor.css'; // Reuse dashboard layout css
import ComboBox from '@/components/common/ComboBox';
import { GRADES } from '@/lib/constants';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userName, setUserName] = useState('Trần Học Sinh');
  const [userEmail, setUserEmail] = useState('student@tutor.com');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedPhone = localStorage.getItem('userPhone');
    const savedGender = localStorage.getItem('userGender');
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
    if (savedPhone) setPhone(savedPhone);
    if (savedGender) setGender(savedGender);
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  const [savedTutors, setSavedTutors] = useState([
    { id: 1, name: "Nguyễn Văn A", role: "Sinh viên năm 3 - ĐH Bách Khoa TP.HCM", rating: 4.9, avatar: "N" }
  ]);

  const handleUnsave = (id: number) => {
    setSavedTutors(savedTutors.filter(tutor => tutor.id !== id));
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <div className="container dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar card glass">
        <div className="profile-summary flex-center" style={{flexDirection: 'column', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)'}}>
          {userAvatar ? (
            <img src={userAvatar} alt="avatar" className="tutor-avatar-large" style={{objectFit: 'cover', border: '3px solid var(--primary)', borderRadius: '50%', background: 'transparent'}} />
          ) : (
            <div className="tutor-avatar-large" style={{background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>{userName.charAt(0).toUpperCase()}</div>
          )}
          <div style={{textAlign: 'center'}}>
            <h3 style={{fontSize: '1.25rem', color: '#D94625'}}>{userName}</h3>
            <p className="text-muted">Học sinh</p>
          </div>
        </div>
        
        <nav className="dashboard-nav" style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')} style={{width: '100%', background: activeTab === 'profile' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <User size={20}/> Hồ sơ cá nhân
          </button>
          <button className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')} style={{width: '100%', background: activeTab === 'saved' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <Heart size={20}/> Gia sư đã lưu
          </button>
          <Link href="/students/posts" className="nav-item" style={{textDecoration: 'none'}}><FileText size={20}/> Quản lý Bài đăng</Link>
          <a href="#" className="nav-item" style={{textDecoration: 'none'}}><Settings size={20}/> Cài đặt tài khoản</a>
          <a href="#" onClick={handleLogout} className="nav-item text-muted" style={{marginTop: 'auto', textDecoration: 'none'}}><LogOut size={20}/> Đăng xuất</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'profile' && (
          <div className="card glass">
            <h2 style={{color: '#D94625', marginBottom: '2rem'}}>Hồ sơ Học sinh</h2>

            <form className="profile-form">
              <div className="form-group" style={{marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderBottom: '1px dashed var(--border)', paddingBottom: '1.5rem'}}>
                <label style={{alignSelf: 'flex-start', fontWeight: 600}}>Ảnh đại diện</label>
                <div className="flex-center" style={{flexDirection: 'column', gap: '1rem'}}>
                  {userAvatar ? (
                    <img src={userAvatar} alt="avatar preview" style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: 'transparent'}} />
                  ) : (
                    <div style={{width: '100px', height: '100px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold'}}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-center" style={{gap: '1rem'}}>
                    <label className="btn btn-outline" style={{cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      Tải ảnh lên
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{display: 'none'}} 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUserAvatar(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                    {userAvatar && (
                      <button 
                        type="button" 
                        className="btn" 
                        style={{background: 'none', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.9rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}
                        onClick={() => setUserAvatar('')}
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" className="input-field" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="input-field" value={userEmail} readOnly style={{backgroundColor: '#f3f4f6'}} />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="flex-center" style={{gap: '0.4rem', justifyContent: 'flex-start'}}><Phone size={16} /> Số điện thoại</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Ví dụ: 0901 234 567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="flex-center" style={{gap: '0.4rem', justifyContent: 'flex-start'}}><Users size={16} /> Giới tính</label>
                  <div className="flex-center" style={{gap: '1.5rem', justifyContent: 'flex-start', marginTop: '0.5rem'}}>
                    <label className="flex-center" style={{gap: '0.5rem', cursor: 'pointer', fontWeight: gender === 'Nam' ? 700 : 400}}>
                      <input
                        type="radio"
                        name="student-gender"
                        value="Nam"
                        checked={gender === 'Nam'}
                        onChange={() => setGender('Nam')}
                        style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}}
                      /> Nam
                    </label>
                    <label className="flex-center" style={{gap: '0.5rem', cursor: 'pointer', fontWeight: gender === 'Nữ' ? 700 : 400}}>
                      <input
                        type="radio"
                        name="student-gender"
                        value="Nữ"
                        checked={gender === 'Nữ'}
                        onChange={() => setGender('Nữ')}
                        style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}}
                      /> Nữ
                    </label>
                  </div>
                </div>
              </div>

              <h3 className="section-subtitle"><Target size={20} /> Tình trạng & Mục tiêu học tập</h3>
              <div className="form-group">
                <ComboBox label="Lớp đang học" placeholder="Chọn lớp..." options={GRADES} />
              </div>
              <div className="form-group">
                <label>Mục tiêu & Sở thích (Giúp gia sư hiểu bạn hơn)</label>
                <textarea className="input-field" rows={4} placeholder="Ví dụ: Mục tiêu đạt 8.0 Toán cuối kỳ, thích học qua hình ảnh minh họa..." style={{resize: 'vertical'}}></textarea>
              </div>

              <h3 className="section-subtitle"><MapPin size={20} /> Khu vực & Thông tin liên hệ</h3>
              <div className="form-group">
                <label>Nơi ở hiện tại</label>
                <input type="text" className="input-field" placeholder="Ví dụ: Quận Bình Thạnh, TP.HCM" />
              </div>
              
              <div className="flex-center" style={{marginTop: '2rem', justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  className="btn btn-primary flex-center"
                  style={{gap: '0.5rem'}}
                  onClick={() => {
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('userPhone', phone);
                    localStorage.setItem('userGender', gender);
                    localStorage.setItem('userAvatar', userAvatar);
                    window.dispatchEvent(new Event('storage'));
                    alert('Đã lưu thay đổi!');
                  }}
                >
                  <CheckCircle size={20}/> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="card glass">
            <h2 style={{color: '#D94625', marginBottom: '2rem'}}>Gia sư đã lưu</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {savedTutors.length === 0 ? (
                <div style={{textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)'}}>
                  <Heart size={48} style={{margin: '0 auto 1rem auto', opacity: 0.2}} />
                  <p>Bạn chưa lưu hồ sơ gia sư nào.</p>
                  <Link href="/students" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block', textDecoration: 'none'}}>Tìm gia sư ngay</Link>
                </div>
              ) : (
                savedTutors.map(tutor => (
                  <div key={tutor.id} className="flex-between" style={{padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--background)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'}}>
                    <div className="flex-center" style={{gap: '1.5rem'}}>
                      <div style={{width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', boxShadow: '0 4px 10px rgba(217, 70, 37, 0.2)'}}>{tutor.avatar}</div>
                      <div>
                        <h3 style={{marginBottom: '0.25rem', color: 'var(--text-main)', fontSize: '1.2rem'}}>{tutor.name}</h3>
                        <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '0.4rem'}}>{tutor.role}</p>
                        <div className="flex-center" style={{gap: '0.25rem', color: '#F59E0B', fontSize: '0.85rem', fontWeight: 600}}>
                          <Star fill="currentColor" size={14} /> {tutor.rating}
                        </div>
                      </div>
                    </div>
                    <div className="flex-center" style={{gap: '1rem'}}>
                      <button className="btn btn-outline flex-center" style={{gap: '0.5rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem'}} onClick={() => handleUnsave(tutor.id)}>
                         Bỏ lưu
                      </button>
                      <Link href="/tutors/123" className="btn btn-primary" style={{padding: '0.5rem 1.5rem', textDecoration: 'none'}}>Xem Profile</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

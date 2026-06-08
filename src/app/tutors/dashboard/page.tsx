"use client";

import { useState, useEffect } from 'react';
import { User, Book, MapPin, Award, CheckCircle, Settings, LogOut, Briefcase, Heart, Trash2, Phone, Users } from 'lucide-react';
import Link from 'next/link';
import ComboBox from '@/components/common/ComboBox';
import './tutor.css';

export default function TutorDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isAccepting, setIsAccepting] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
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
  
  const [savedStudents, setSavedStudents] = useState<any[]>([]);

  const handleUnsave = (id: number) => {
    setSavedStudents(savedStudents.filter(student => student.id !== id));
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
            <div className="tutor-avatar-large" style={{background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{userName ? userName.charAt(0).toUpperCase() : 'G'}</div>
          )}
          <div style={{textAlign: 'center'}}>
            <h3 style={{fontSize: '1.25rem', color: '#D94625'}}>{userName || 'Gia sư'}</h3>
            <p className="text-muted">Gia sư</p>
          </div>
        </div>
        
        <nav className="dashboard-nav" style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')} style={{width: '100%', background: activeTab === 'profile' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem'}}>
            <User size={20}/> Hồ sơ cá nhân
          </button>
          <button className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')} style={{width: '100%', background: activeTab === 'applications' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem'}}>
            <Briefcase size={20}/> Lớp đã ứng tuyển
          </button>
          <button className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')} style={{width: '100%', background: activeTab === 'saved' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <Heart size={20}/> Học sinh đã lưu
          </button>
          <a href="/tutors/reviews" className="nav-item" style={{textDecoration: 'none'}}><Award size={20}/> Quản lý đánh giá</a>
          <a href="#" className="nav-item" style={{textDecoration: 'none'}}><Settings size={20}/> Cài đặt tài khoản</a>
          <a href="#" onClick={handleLogout} className="nav-item text-muted" style={{marginTop: 'auto', textDecoration: 'none'}}><LogOut size={20}/> Đăng xuất</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'profile' && (
          <div className="card glass">
            {/* Same profile content as before */}
            <div className="flex-between" style={{marginBottom: '2rem'}}>
              <h2 style={{color: '#D94625'}}>Hồ sơ cá nhân</h2>
              <div className="status-toggle flex-center" style={{gap: '0.75rem'}}>
                <span style={{fontWeight: 600, color: isAccepting ? '#10B981' : 'var(--text-muted)'}}>
                  {isAccepting ? 'Đang nhận lớp' : 'Ngừng nhận lớp'}
                </span>
                <label className="switch">
                  <input type="checkbox" checked={isAccepting} onChange={() => setIsAccepting(!isAccepting)} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <form className="profile-form">
              <div className="form-group" style={{marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderBottom: '1px dashed var(--border)', paddingBottom: '1.5rem'}}>
                <label style={{alignSelf: 'flex-start', fontWeight: 600}}>Ảnh đại diện</label>
                <div className="flex-center" style={{flexDirection: 'column', gap: '1rem'}}>
                  {userAvatar ? (
                    <img src={userAvatar} alt="avatar preview" style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: 'transparent'}} />
                  ) : (
                    <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold'}}>
                      {userName ? userName.charAt(0).toUpperCase() : 'G'}
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
                        name="tutor-gender"
                        value="Nam"
                        checked={gender === 'Nam'}
                        onChange={() => setGender('Nam')}
                        style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}}
                      /> Nam
                    </label>
                    <label className="flex-center" style={{gap: '0.5rem', cursor: 'pointer', fontWeight: gender === 'Nữ' ? 700 : 400}}>
                      <input
                        type="radio"
                        name="tutor-gender"
                        value="Nữ"
                        checked={gender === 'Nữ'}
                        onChange={() => setGender('Nữ')}
                        style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}}
                      /> Nữ
                    </label>
                  </div>
                </div>
              </div>

              <h3 className="section-subtitle"><Book size={20} /> Chuyên môn & Lớp dạy</h3>
              <div className="form-group">
                <label>Các môn học có thể dạy</label>
                <input type="text" className="input-field" placeholder="Ví dụ: Toán, Vật lý, Tiếng Anh..." />
              </div>
              <div className="form-group">
                <label>Các lớp có thể dạy</label>
                <input type="text" className="input-field" placeholder="Ví dụ: Lớp 10, Lớp 11, Luyện thi IELTS..." />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Học phí mong muốn (VNĐ/giờ)</label>
                  <input type="number" className="input-field" placeholder="Ví dụ: 150000" />
                </div>
                <ComboBox label="Giọng nói vùng miền" placeholder="Chọn miền..." options={["Miền Bắc", "Miền Trung", "Miền Nam", "Bất kỳ"]} />
              </div>

              <h3 className="section-subtitle"><MapPin size={20} /> Khu vực hoạt động</h3>
              <div className="form-group">
                <label>Địa điểm có thể đến dạy</label>
                <input type="text" className="input-field" placeholder="Ví dụ: Quận 1, Quận 3, Quận Bình Thạnh (TP.HCM)" />
              </div>

              <h3 className="section-subtitle"><Award size={20} /> Thành tích cá nhân</h3>
              <div className="form-group">
                <label>Kinh nghiệm & Thành tích (Sẽ hiển thị cho Học sinh)</label>
                <textarea className="input-field" rows={4} placeholder="Ví dụ: Sinh viên năm 3 Đại học Sư Phạm, đạt IELTS 8.0, có 2 năm kinh nghiệm dạy kèm..." style={{resize: 'vertical'}}></textarea>
              </div>
              
              <div className="flex-center" style={{marginTop: '1rem', justifyContent: 'flex-end'}}>
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

        {activeTab === 'applications' && (
          <div className="card glass">
            <h2 style={{color: '#D94625', marginBottom: '2rem'}}>Lớp đã ứng tuyển</h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
               <p className="text-muted" style={{textAlign: 'center', padding: '2rem'}}>Bạn chưa ứng tuyển vào lớp nào.</p>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="card glass">
            <h2 style={{color: '#D94625', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Heart size={24} /> Học sinh đã lưu
            </h2>
            
            {savedStudents.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 1rem', background: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)'}}>
                <Heart size={48} className="text-muted" style={{marginBottom: '1rem', opacity: 0.5}} />
                <h3 style={{marginBottom: '0.5rem', color: 'var(--text-main)'}}>Bạn chưa lưu hồ sơ học sinh nào</h3>
                <p className="text-muted" style={{marginBottom: '1.5rem'}}>Hãy lướt xem các lớp học và lưu lại những học sinh phù hợp nhé.</p>
                <Link href="/tutors/jobs" className="btn btn-primary">Tìm học sinh ngay</Link>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {savedStudents.map((student) => (
                  <div key={student.id} style={{border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)'}} className="hover-shadow">
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                      <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold'}}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-main)'}}>{student.name}</h3>
                        <p className="text-muted" style={{fontSize: '0.9rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                          <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Book size={14} /> {student.needs}</span>
                          <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><MapPin size={14} /> {student.location}</span>
                        </p>
                        <p style={{fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.25rem'}}>{student.price}</p>
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <Link href={`/students/${student.id}`} className="btn btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>Xem Profile</Link>
                      <button 
                        className="btn" 
                        style={{padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid #EF4444', color: '#EF4444', background: 'transparent'}}
                        onClick={() => handleUnsave(student.id)}
                      >
                        <Trash2 size={16} /> Bỏ lưu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

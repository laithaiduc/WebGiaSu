"use client";

import { useState, useEffect } from 'react';
import { User, Target, MapPin, CheckCircle, Settings, LogOut, Heart, Star, Phone, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../tutors/dashboard/tutor.css'; // Reuse dashboard layout css
import ComboBox from '@/components/common/ComboBox';
import { GRADES } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { fetchSavedTutorsForStudent, unsaveTutorProfile } from '@/lib/api';


export default function StudentDashboard() {
  const { user, loading, logout, saveProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileErrors, setProfileErrors] = useState<{phone?: string; gender?: string}>({});
  const [userName, setUserName] = useState('Trần Học Sinh');
  const [userEmail, setUserEmail] = useState('student@tutor.com');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [grade, setGrade] = useState('');
  const [goal, setGoal] = useState('');
  const [location, setLocation] = useState('');
  
  useEffect(() => {
    if (user) {
      setUserName(user.name || 'Học sinh');
      setUserEmail(user.email || '');
      setUserAvatar(user.avatar || '');
      setPhone(user.phone || '');
      setGender(user.gender || '');
    }
  }, [user]);

  const [savedTutors, setSavedTutors] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    fetchSavedTutorsForStudent(user.id)
      .then((res) => setSavedTutors(res.data || []))
      .catch(() => setSavedTutors([]));
  }, [user]);

  // Route guard: chỉ học sinh mới vào được trang này
  useEffect(() => {
    if (!user && !loading) {
      router.replace('/login');
    } else if (user && user.role !== 'student') {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleUnsave = async (id: number) => {
    try {
      await unsaveTutorProfile(id);
      setSavedTutors((current) => current.filter((tutor) => tutor.id !== id));
    } catch {
      alert('Không thể bỏ lưu gia sư.');
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
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
        
        <nav className="dashboard-nav">
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={20}/> Hồ sơ cá nhân
          </button>
          <button className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            <Heart size={20}/> Gia sư đã lưu
          </button>
          <Link href="/students/dashboard" className="nav-item">
            <Settings size={20}/> Cài đặt tài khoản
          </Link>
          <a href="#" onClick={handleLogout} className="nav-item text-muted" style={{marginTop: 'auto'}}>
            <LogOut size={20}/> Đăng xuất
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'profile' && (
          <div className="card glass">
            <h2 style={{color: '#D94625', marginBottom: '2rem'}}>Hồ sơ Học sinh</h2>

            <form className="profile-form">
              <div className="form-group" style={{marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(253,186,116,0.3)'}}>
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
                  <label>Họ và tên <span style={{color:'#EF4444'}}>*</span></label>
                  <input type="text" className="input-field" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email <span style={{color:'#EF4444'}}>*</span></label>
                  <input type="email" className="input-field" value={userEmail} readOnly style={{backgroundColor: '#f3f4f6', cursor: 'not-allowed'}} />
                  <span style={{fontSize:'0.78rem', color:'var(--text-muted)', marginTop:'0.25rem', display:'block'}}>Đây là email tài khoản, không thể thay đổi</span>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="flex-center" style={{gap: '0.4rem', justifyContent: 'flex-start'}}>
                    <Phone size={16} /> Số điện thoại <span style={{color:'#EF4444'}}>*</span>
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Ví dụ: 0901 234 567"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (e.target.value.trim()) setProfileErrors(prev => ({...prev, phone: undefined})); }}
                    style={{borderColor: profileErrors.phone ? '#EF4444' : undefined}}
                  />
                  {profileErrors.phone && <span style={{color:'#EF4444', fontSize:'0.8rem', marginTop:'0.3rem', display:'flex', alignItems:'center', gap:'0.3rem'}}>⚠️ {profileErrors.phone}</span>}
                </div>
                <div className="form-group">
                  <label className="flex-center" style={{gap: '0.4rem', justifyContent: 'flex-start'}}>
                    <Users size={16} /> Giới tính <span style={{color:'#EF4444'}}>*</span>
                  </label>
                  <div className="flex-center" style={{gap: '1.5rem', justifyContent: 'flex-start', marginTop: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', border: profileErrors.gender ? '1.5px solid #EF4444' : '1.5px solid transparent', background: profileErrors.gender ? 'rgba(239,68,68,0.04)' : 'transparent'}}>
                    <label className="flex-center" style={{gap: '0.5rem', cursor: 'pointer', fontWeight: gender === 'Nam' ? 700 : 400}}>
                      <input type="radio" name="student-gender" value="Nam" checked={gender === 'Nam'}
                        onChange={() => { setGender('Nam'); setProfileErrors(prev => ({...prev, gender: undefined})); }}
                        style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}} /> Nam
                    </label>
                    <label className="flex-center" style={{gap: '0.5rem', cursor: 'pointer', fontWeight: gender === 'Nữ' ? 700 : 400}}>
                      <input type="radio" name="student-gender" value="Nữ" checked={gender === 'Nữ'}
                        onChange={() => { setGender('Nữ'); setProfileErrors(prev => ({...prev, gender: undefined})); }}
                        style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}} /> Nữ
                    </label>
                  </div>
                  {profileErrors.gender && <span style={{color:'#EF4444', fontSize:'0.8rem', marginTop:'0.3rem', display:'flex', alignItems:'center', gap:'0.3rem'}}>⚠️ {profileErrors.gender}</span>}
                </div>
              </div>

              <h3 className="section-subtitle"><Target size={20} /> Tình trạng & Mục tiêu học tập</h3>
              <div className="form-group">
                <ComboBox label="Lớp đang học" placeholder="Chọn lớp..." options={GRADES} value={grade} onChange={setGrade} />
              </div>
              <div className="form-group">
                <label>Mục tiêu & Sở thích (Giúp gia sư hiểu bạn hơn)</label>
                <textarea className="input-field" rows={4} placeholder="Ví dụ: Mục tiêu đạt 8.0 Toán cuối kỳ..." style={{resize: 'vertical'}} value={goal} onChange={e => setGoal(e.target.value)} />
              </div>

              <h3 className="section-subtitle"><MapPin size={20} /> Khu vực & Thông tin liên hệ</h3>
              <div className="form-group">
                <label>Nơi ở hiện tại</label>
                <input type="text" className="input-field" placeholder="Ví dụ: Quận Bình Thạnh, TP.HCM" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              
              <div className="flex-center" style={{marginTop: '2rem', justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  className="btn btn-primary flex-center"
                  style={{gap: '0.5rem'}}
                  onClick={async () => {
                    const errs: {phone?: string; gender?: string} = {};
                    if (!phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
                    else if (!/^[0-9\s+\-().]{8,15}$/.test(phone.trim())) errs.phone = 'Số điện thoại không hợp lệ';
                    if (!gender) errs.gender = 'Vui lòng chọn giới tính';
                    if (Object.keys(errs).length > 0) {
                      setProfileErrors(errs);
                      return;
                    }
                    setProfileErrors({});
                    try {
                      await saveProfile({
                        name: userName,
                        phone,
                        gender,
                        avatar: userAvatar,
                      });
                      alert('Đã lưu thay đổi!');
                    } catch {
                      alert('Không thể lưu thay đổi. Vui lòng thử lại.');
                    }
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
                  <div key={tutor.id} className="dashboard-item-card hover-shadow">
                    <div className="dashboard-item-info">
                      {tutor.avatar ? (
                        <img src={tutor.avatar} alt={tutor.name} className="dashboard-item-avatar-img" />
                      ) : (
                        <div className="dashboard-item-avatar tutor-avatar-color">{tutor.name?.charAt(0).toUpperCase()}</div>
                      )}
                      <div className="dashboard-item-details">
                        <h3 className="dashboard-item-name">{tutor.name}</h3>
                        <p className="text-muted dashboard-item-sub">{tutor.subjects || tutor.location || 'Gia sư'}</p>
                        <div className="flex-center" style={{gap: '0.25rem', color: '#F59E0B', fontSize: '0.85rem', fontWeight: 600, justifyContent: 'flex-start'}}>
                          <Star fill="currentColor" size={14} /> {Number(tutor.rating ?? 0).toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-item-actions">
                      <button className="btn btn-danger-outline dashboard-btn" onClick={() => handleUnsave(tutor.id)}>
                         Bỏ lưu
                      </button>
                      <Link href={`/tutors/${tutor.id}`} className="btn btn-primary dashboard-btn">Xem Profile</Link>
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

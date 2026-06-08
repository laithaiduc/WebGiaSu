"use client";

import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedRole) setRole(savedRole);
    if (savedName) setUserName(savedName);
    if (savedAvatar) setUserAvatar(savedAvatar);

    // Listen for storage changes (when user saves profile)
    const handleStorage = () => {
      const n = localStorage.getItem('userName');
      const a = localStorage.getItem('userAvatar');
      if (n) setUserName(n);
      if (a) setUserAvatar(a);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="container flex-between nav-content">
        <Link href="/" className="logo flex-center">
          <div className="logo-icon">G</div>
          <span style={{color: '#D94625'}}>GIA SƯ KẾT NỐI</span>
        </Link>

        <div className="nav-links desktop-only">
          {role === 'student' && (
            <>
              <Link href="/students" className="nav-link">Tìm Gia Sư</Link>
              <Link href="/students/jobs" className="nav-link">Bảng Tin Lớp Học</Link>
            </>
          )}
          
          {role === 'tutor' && (
            <>
              <Link href="/tutors/jobs" className="nav-link">Nhận Lớp Mới</Link>
            </>
          )}

          {role === 'admin' && (
             <Link href="/admin" className="nav-link">Admin Portal</Link>
          )}
          
          {/* If not logged in or just default home page */}
          {!role && (
            <>
              <Link href="/students" className="nav-link">Xem Danh Sách Gia Sư</Link>
            </>
          )}
        </div>

        <div className="nav-actions desktop-only" style={{gap: '1.5rem', alignItems: 'center'}}>
          {role ? (
            <div className="dropdown">
              <div className="flex-center" style={{gap: '0.5rem', cursor: 'pointer'}}>
                {userAvatar ? (
                  <img src={userAvatar} alt="avatar" style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', background: 'transparent'}} />
                ) : (
                  <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                    {userName ? userName.charAt(0).toUpperCase() : (role === 'admin' ? 'A' : role === 'tutor' ? 'G' : 'H')}
                  </div>
                )}
                <span style={{fontWeight: 700}}>
                  {userName || (role === 'admin' ? 'Quản trị viên' : role === 'tutor' ? 'Gia sư' : 'Học sinh')} ▾
                </span>
              </div>
              <div className="dropdown-content" style={{right: 0, left: 'auto', minWidth: '180px'}}>
                {role === 'admin' ? (
                  <Link href="/admin" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}><User size={16}/> Admin Portal</Link>
                ) : role === 'tutor' ? (
                  <>
                    <Link href="/tutors/dashboard" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}><User size={16}/> Hồ sơ Gia sư</Link>
                    <Link href="/tutors/posts" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Mở Lớp Học (Tuyển Sinh)</Link>
                  </>
                ) : (
                  <>
                    <Link href="/students/dashboard" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}><User size={16}/> Hồ sơ Học sinh</Link>
                    <Link href="/students/posts" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Quản lý Tìm Gia sư</Link>
                  </>
                )}
                
                <button onClick={handleLogout} className="flex-center" style={{width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 600, justifyContent: 'flex-start', gap: '0.5rem', transition: 'var(--transition)'}}><LogOut size={16}/> Đăng xuất</button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-link" style={{color: '#D94625', fontWeight: 700}}>Đăng Nhập</Link>
              <Link href="/register" className="btn btn-primary">Đăng Ký</Link>
            </>
          )}
        </div>

        <button className="mobile-menu-btn mobile-only" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu mobile-only">
          {role === 'student' && (
            <>
              <Link href="/students" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Tìm Gia Sư</Link>
              <Link href="/students/jobs" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Bảng Tin Lớp Học</Link>
              <Link href="/students/dashboard" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Hồ sơ Học sinh</Link>
              <Link href="/students/posts" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Quản lý Tìm Gia sư</Link>
            </>
          )}
          
          {role === 'tutor' && (
            <>
              <Link href="/tutors/jobs" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Nhận Lớp Mới</Link>
              <Link href="/tutors/dashboard" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Hồ sơ Gia sư</Link>
              <Link href="/tutors/posts" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Mở Lớp Học (Tuyển Sinh)</Link>
            </>
          )}

          {role === 'admin' && (
            <Link href="/admin" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Portal</Link>
          )}

          {!role && (
            <>
              <Link href="/students" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Xem Danh Sách Gia Sư</Link>
              <Link href="/login" className="mobile-link" style={{color: '#D94625', fontWeight: 700}} onClick={() => setIsMobileMenuOpen(false)}>Đăng Nhập</Link>
              <Link href="/register" className="btn btn-primary" style={{width: '100%', marginTop: '0.5rem', textAlign: 'center'}} onClick={() => setIsMobileMenuOpen(false)}>Đăng Ký</Link>
            </>
          )}

          {role && (
            <button onClick={handleLogout} className="mobile-link" style={{color: '#DC2626', background: 'none', border: 'none', textAlign: 'left', width: '100%', fontWeight: 700}}>Đăng xuất</button>
          )}
        </div>
      )}
    </nav>
  );
}

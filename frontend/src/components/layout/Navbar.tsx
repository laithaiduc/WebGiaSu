"use client";

import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { useRealtime } from '@/context/RealtimeContext';
import "./Navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useRealtime();
  const role = user?.role || null;
  const userName = user?.name || '';
  const userAvatar = user?.avatar || '';

  const handleLogout = async () => {
    await logout();
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
                    <Link href="/tutors/posts" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}>Mở Lớp Học (Tuyển Sinh)</Link>
                    <Link href="/tutors/messages" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}>
                      Tin nhắn {unreadCount > 0 && <span className="nav-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/students/dashboard" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}><User size={16}/> Hồ sơ Học sinh</Link>
                    <Link href="/students/posts" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}>Quản lý Tìm Gia sư</Link>
                    <Link href="/students/messages" className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none'}}>
                      Tin nhắn {unreadCount > 0 && <span className="nav-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                    </Link>
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
              <Link href="/students/messages" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                Tin nhắn {unreadCount > 0 ? `(${unreadCount > 99 ? '99+' : unreadCount})` : ''}
              </Link>
            </>
          )}
          {role === 'tutor' && (
            <>
              <Link href="/tutors/jobs" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Nhận Lớp Mới</Link>
              <Link href="/tutors/dashboard" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Hồ sơ Gia sư</Link>
              <Link href="/tutors/posts" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Mở Lớp Học (Tuyển Sinh)</Link>
              <Link href="/tutors/messages" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                Tin nhắn {unreadCount > 0 ? `(${unreadCount > 99 ? '99+' : unreadCount})` : ''}
              </Link>
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

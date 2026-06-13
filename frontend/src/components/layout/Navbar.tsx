"use client";

import Link from "next/link";
import { Menu, X, User, LogOut, MessageSquare, FileText, BookOpen, Search, Newspaper, Inbox } from "lucide-react";
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

  const close = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container flex-between nav-content">
        {/* Logo */}
        <Link href="/" className="logo flex-center">
          <div className="logo-icon">G</div>
          <span style={{ color: '#D94625' }}>GIA SƯ KẾT NỐI</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links desktop-only">

          {/* ===== STUDENT ===== */}
          {role === 'student' && (
            <>
              <Link href="/students" className="nav-link">
                <Search size={15} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Tìm Gia Sư
              </Link>
              <Link href="/students/jobs" className="nav-link">
                <Newspaper size={15} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Bảng Tin Lớp Học
              </Link>
              {/* Bài đăng — action chính, đưa lên navbar */}
              <Link href="/students/posts" className="nav-link">
                <FileText size={16} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Bài đăng
              </Link>
              {/* Tin nhắn — đưa lên navbar với badge */}
              <Link href="/students/messages" className="nav-link" style={{ position: 'relative' }}>
                <MessageSquare size={16} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Tin nhắn
                {unreadCount > 0 && (
                  <span className="nav-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </Link>
            </>
          )}

          {/* ===== TUTOR ===== */}
          {role === 'tutor' && (
            <>
              <Link href="/tutors/jobs" className="nav-link">
                <Inbox size={15} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Nhận Lớp Mới
              </Link>
              {/* Mở Lớp Học — action chính, đưa lên navbar */}
              <Link href="/tutors/posts" className="nav-link">
                <BookOpen size={16} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Mở Lớp Học
              </Link>
              {/* Tin nhắn — đưa lên navbar với badge */}
              <Link href="/tutors/messages" className="nav-link" style={{ position: 'relative' }}>
                <MessageSquare size={16} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Tin nhắn
                {unreadCount > 0 && (
                  <span className="nav-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </Link>
            </>
          )}

          {/* ===== ADMIN ===== */}
          {role === 'admin' && (
            <Link href="/admin" className="nav-link">Admin Portal</Link>
          )}

          {/* ===== GUEST ===== */}
          {!role && (
            <Link href="/students" className="nav-link">Xem Danh Sách Gia Sư</Link>
          )}
        </div>

        {/* Desktop Actions (Avatar dropdown — chỉ còn hồ sơ) */}
        <div className="nav-actions desktop-only" style={{ gap: '1.5rem', alignItems: 'center' }}>
          {role ? (
            <div className="dropdown">
              <div className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                {userAvatar ? (
                  <img src={userAvatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', background: 'transparent' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {userName ? userName.charAt(0).toUpperCase() : (role === 'admin' ? 'A' : role === 'tutor' ? 'G' : 'H')}
                  </div>
                )}
                <span style={{ fontWeight: 700 }}>
                  {userName || (role === 'admin' ? 'Quản trị viên' : role === 'tutor' ? 'Gia sư' : 'Học sinh')} ▾
                </span>
              </div>

              {/* Dropdown chỉ còn hồ sơ & đăng xuất */}
              <div className="dropdown-content" style={{ right: 0, left: 'auto', minWidth: '190px' }}>
                {role === 'admin' ? (
                  <Link href="/admin" className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none' }}>
                    <User size={16} /> Admin Portal
                  </Link>
                ) : role === 'tutor' ? (
                  <>
                    <Link href="/tutors/dashboard" className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none' }}>
                      <User size={16} /> Hồ sơ & Cài đặt
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/students/dashboard" className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', textDecoration: 'none' }}>
                      <User size={16} /> Hồ sơ & Cài đặt
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex-center"
                  style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 600, justifyContent: 'flex-start', gap: '0.5rem', transition: 'var(--transition)' }}
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-link" style={{ color: '#D94625', fontWeight: 700 }}>Đăng Nhập</Link>
              <Link href="/register" className="btn btn-primary">Đăng Ký</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn mobile-only" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu mobile-only">

          {role === 'student' && (
            <>
              <Link href="/students" className="mobile-link" onClick={close}>Tìm Gia Sư</Link>
              <Link href="/students/jobs" className="mobile-link" onClick={close}>Bảng Tin Lớp Học</Link>
              <Link href="/students/posts" className="mobile-link" onClick={close}>Bài đăng của tôi</Link>
              <Link href="/students/messages" className="mobile-link" onClick={close}>
                Tin nhắn {unreadCount > 0 ? `(${unreadCount > 99 ? '99+' : unreadCount})` : ''}
              </Link>
              <Link href="/students/dashboard" className="mobile-link" onClick={close}>Hồ sơ & Cài đặt</Link>
            </>
          )}

          {role === 'tutor' && (
            <>
              <Link href="/tutors/jobs" className="mobile-link" onClick={close}>Nhận Lớp Mới</Link>
              <Link href="/tutors/posts" className="mobile-link" onClick={close}>Mở Lớp Học</Link>
              <Link href="/tutors/messages" className="mobile-link" onClick={close}>
                Tin nhắn {unreadCount > 0 ? `(${unreadCount > 99 ? '99+' : unreadCount})` : ''}
              </Link>
              <Link href="/tutors/dashboard" className="mobile-link" onClick={close}>Hồ sơ & Cài đặt</Link>
            </>
          )}

          {role === 'admin' && (
            <Link href="/admin" className="mobile-link" onClick={close}>Admin Portal</Link>
          )}

          {!role && (
            <>
              <Link href="/students" className="mobile-link" onClick={close}>Xem Danh Sách Gia Sư</Link>
              <Link href="/login" className="mobile-link" style={{ color: '#D94625', fontWeight: 700 }} onClick={close}>Đăng Nhập</Link>
              <Link href="/register" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', textAlign: 'center' }} onClick={close}>Đăng Ký</Link>
            </>
          )}

          {role && (
            <button onClick={handleLogout} className="mobile-link" style={{ color: '#DC2626', background: 'none', border: 'none', textAlign: 'left', width: '100%', fontWeight: 700 }}>
              Đăng xuất
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

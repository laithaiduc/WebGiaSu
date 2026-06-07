"use client";
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import './auth.css';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check simulated database first
    const existingUsersStr = localStorage.getItem('registeredUsers');
    const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    
    const matchedUser = existingUsers.find((u: any) => u.email === email && u.password === password);
    
    if (matchedUser) {
      localStorage.setItem('userRole', matchedUser.role);
      localStorage.setItem('userEmail', matchedUser.email);
      localStorage.setItem('userName', matchedUser.name);
      if (matchedUser.role === 'student') window.location.href = '/students/dashboard';
      else if (matchedUser.role === 'tutor') window.location.href = '/tutors/dashboard';
      else window.location.href = '/admin';
      return;
    }

    // Fallback to mock accounts
    if (email === 'admin@tutor.com' && password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', 'Quản trị viên');
      window.location.href = '/admin';
    } else if (email === 'tutor@tutor.com') {
      localStorage.setItem('userRole', 'tutor');
      localStorage.setItem('userName', 'Gia sư Trần B');
      window.location.href = '/tutors/dashboard';
    } else if (email === 'student@tutor.com') {
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userName', 'Học sinh Văn A');
      window.location.href = '/students/dashboard';
    } else {
      setError('Sai email hoặc mật khẩu! Dùng tài khoản mẫu hoặc đăng ký tài khoản mới.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="logo-auth">
            <div className="logo-auth-icon">G</div>
            <span style={{color: '#D94625', fontWeight: 800, fontSize: '1.25rem'}}>GIA SƯ KẾT NỐI</span>
          </Link>
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>
        
        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div style={{color: '#DC2626', background: 'rgba(220,38,38,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</div>}
          
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input type="email" className="input-field" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <small style={{color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block', fontSize: '0.8rem'}}>
              Gợi ý tài khoản: student@tutor.com | tutor@tutor.com | admin@tutor.com
            </small>
          </div>
          
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input type="password" className="input-field" placeholder="Nhập mật khẩu (nhập bừa trừ admin)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          
          <div className="auth-options" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <label style={{display: 'flex', gap: '0.5rem', cursor: 'pointer', alignItems: 'center'}}>
              <input type="checkbox" style={{accentColor: 'var(--primary)'}} /> Ghi nhớ
            </label>
            <a href="#" className="text-primary">Quên mật khẩu?</a>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>
            Đăng Nhập
          </button>
        </form>
        
        <p className="auth-footer">
          Chưa có tài khoản? <Link href="/register" className="text-primary">Đăng Ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

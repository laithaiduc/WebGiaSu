"use client";

import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../login/auth.css'; // Reuse auth.css

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to simulated database (localStorage)
    const existingUsersStr = localStorage.getItem('registeredUsers');
    const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    
    // Check if email exists
    if (existingUsers.find((u: any) => u.email === email)) {
      alert("Email này đã được đăng ký!");
      return;
    }

    const newUser = { name, email, password, role };
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    alert("Đăng ký thành công! Hệ thống sẽ chuyển hướng bạn đến trang Đăng nhập.");
    router.push('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="logo-auth">
            <div className="logo-auth-icon">G</div>
            <span style={{color: '#D94625', fontWeight: 800, fontSize: '1.25rem'}}>GIA SƯ KẾT NỐI</span>
          </Link>
          <h2>Tạo Tài Khoản</h2>
          <p>Bắt đầu hành trình học tập cùng chúng tôi.</p>
        </div>
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Vai trò của bạn</label>
            <div style={{display: 'flex', gap: '1.5rem', marginTop: '0.5rem'}}>
              <label style={{display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', fontWeight: 600}}>
                <input 
                  type="radio" 
                  name="role" 
                  checked={role === 'student'} 
                  onChange={() => setRole('student')}
                  style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}}
                /> Học sinh
              </label>
              <label style={{display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', fontWeight: 600}}>
                <input 
                  type="radio" 
                  name="role" 
                  checked={role === 'tutor'}
                  onChange={() => setRole('tutor')}
                  style={{accentColor: 'var(--primary)', width: '18px', height: '18px'}}
                /> Gia sư
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Họ và tên</label>
            <div className="input-with-icon">
              <User className="input-icon" size={20} />
              <input type="text" className="input-field" placeholder="Nhập họ và tên" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input type="email" className="input-field" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input type="password" className="input-field" placeholder="Tạo mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>
            Đăng Ký Ngay
          </button>
        </form>
        
        <p className="auth-footer">
          Đã có tài khoản? <Link href="/login" className="text-primary">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

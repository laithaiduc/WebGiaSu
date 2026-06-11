"use client";

import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../login/auth.css';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await register({ name, email, password, role });
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'tutor') router.push('/tutors/dashboard');
      else router.push('/students/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại.');
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
          <h2>Tạo Tài Khoản</h2>
          <p>Bắt đầu hành trình học tập cùng chúng tôi.</p>
        </div>
        
        <form className="auth-form" onSubmit={handleRegister}>
          {error && <div style={{color: '#DC2626', background: 'rgba(220,38,38,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</div>}
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

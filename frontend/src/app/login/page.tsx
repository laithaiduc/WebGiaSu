"use client";
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import './auth.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'tutor') router.push('/tutors/dashboard');
      else router.push('/students/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại.');
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
          </div>
          
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input type="password" className="input-field" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
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

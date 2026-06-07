"use client";
import { Users, AlertTriangle, FileText, CheckCircle, XCircle } from 'lucide-react';
import './admin.css';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [pendingTutorPosts, setPendingTutorPosts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('studentPosts');
    if (saved) {
      const allPosts = JSON.parse(saved);
      setPendingPosts(allPosts.filter((p: any) => p.status === 'Chờ duyệt'));
    }

    const savedTutor = localStorage.getItem('tutorPosts');
    if (savedTutor) {
      const allTutorPosts = JSON.parse(savedTutor);
      setPendingTutorPosts(allTutorPosts.filter((p: any) => p.status === 'Chờ duyệt'));
    }
  }, []);

  const handleApprove = (id: number) => {
    const saved = localStorage.getItem('studentPosts');
    if (saved) {
      const allPosts = JSON.parse(saved);
      const updatedPosts = allPosts.map((p: any) => 
        p.id === id ? { ...p, status: 'Đang tìm gia sư' } : p
      );
      localStorage.setItem('studentPosts', JSON.stringify(updatedPosts));
      setPendingPosts(updatedPosts.filter((p: any) => p.status === 'Chờ duyệt'));
      alert("Đã phê duyệt bài đăng của Học sinh!");
    }
  };

  const handleReject = (id: number) => {
    const saved = localStorage.getItem('studentPosts');
    if (saved) {
      const allPosts = JSON.parse(saved);
      const updatedPosts = allPosts.map((p: any) => 
        p.id === id ? { ...p, status: 'Bị từ chối' } : p
      );
      localStorage.setItem('studentPosts', JSON.stringify(updatedPosts));
      setPendingPosts(updatedPosts.filter((p: any) => p.status === 'Chờ duyệt'));
      alert("Đã từ chối bài đăng!");
    }
  };

  const handleApproveTutor = (id: number) => {
    const saved = localStorage.getItem('tutorPosts');
    if (saved) {
      const allPosts = JSON.parse(saved);
      const updatedPosts = allPosts.map((p: any) => 
        p.id === id ? { ...p, status: 'Đang hiển thị' } : p
      );
      localStorage.setItem('tutorPosts', JSON.stringify(updatedPosts));
      setPendingTutorPosts(updatedPosts.filter((p: any) => p.status === 'Chờ duyệt'));
      alert("Đã phê duyệt bài đăng của Gia sư!");
    }
  };

  const handleRejectTutor = (id: number) => {
    const saved = localStorage.getItem('tutorPosts');
    if (saved) {
      const allPosts = JSON.parse(saved);
      const updatedPosts = allPosts.map((p: any) => 
        p.id === id ? { ...p, status: 'Bị từ chối' } : p
      );
      localStorage.setItem('tutorPosts', JSON.stringify(updatedPosts));
      setPendingTutorPosts(updatedPosts.filter((p: any) => p.status === 'Chờ duyệt'));
      alert("Đã từ chối bài đăng của Gia sư!");
    }
  };

  return (
    <div className="container admin-layout">
      <aside className="admin-sidebar glass card">
        <h2 style={{color: '#D94625', marginBottom: '2rem'}}>Admin Portal</h2>
        <nav className="dashboard-nav" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')} style={{width: '100%', background: activeTab === 'users' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem'}}>
            <Users size={20}/> Quản lý Người dùng
          </button>
          <button className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')} style={{width: '100%', background: activeTab === 'posts' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem'}}>
            <FileText size={20}/> Duyệt Bài đăng mới
          </button>
          <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')} style={{width: '100%', background: activeTab === 'reports' ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem'}}>
            <AlertTriangle size={20}/> Báo cáo & Cờ lọc
          </button>
        </nav>
      </aside>
      
      <main className="admin-main card glass">
        {activeTab === 'posts' && (
          <div>
            <h2 style={{color: '#D94625', marginBottom: '1.5rem'}}>Duyệt bài đăng của Học sinh (Hàng chờ: {pendingPosts.length})</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem'}}>
              {pendingPosts.length === 0 ? (
                <p className="text-muted" style={{textAlign: 'center', padding: '2rem'}}>Không có bài đăng nào cần duyệt.</p>
              ) : pendingPosts.map((post) => (
                <div key={post.id} style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'white'}}>
                  <div className="flex-between" style={{marginBottom: '1rem'}}>
                    <span className="badge badge-student">Bài của Học sinh</span>
                    <span className="text-muted">{post.time}</span>
                  </div>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>{post.title}</h3>
                  <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.9rem', flexWrap: 'wrap'}}>
                    <span style={{background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>Môn: {post.subject}</span>
                    <span style={{background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>Lương: {post.price}</span>
                    <span style={{background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>Khu vực: {post.format}</span>
                  </div>
                  <div className="flex-center" style={{gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', justifyContent: 'flex-start'}}>
                    <button className="btn btn-primary flex-center" onClick={() => handleApprove(post.id)} style={{gap: '0.5rem', background: '#10B981'}}><CheckCircle size={18} /> Phê duyệt (Công khai)</button>
                    <button className="btn btn-outline flex-center" onClick={() => handleReject(post.id)} style={{gap: '0.5rem', color: '#DC2626', borderColor: '#DC2626'}}><XCircle size={18} /> Từ chối</button>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{color: '#D94625', marginBottom: '1.5rem'}}>Duyệt quảng cáo Gia sư (Hàng chờ: {pendingTutorPosts.length})</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {pendingTutorPosts.length === 0 ? (
                <p className="text-muted" style={{textAlign: 'center', padding: '2rem'}}>Không có bài quảng cáo Gia sư nào cần duyệt.</p>
              ) : pendingTutorPosts.map((post) => (
                <div key={post.id} style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'white'}}>
                  <div className="flex-between" style={{marginBottom: '1rem'}}>
                    <span className="badge" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6'}}>Bài của Gia sư</span>
                    <span className="text-muted">{post.time}</span>
                  </div>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>{post.title}</h3>
                  <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                    {post.classType === 'group' ? (
                      <span className="badge" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontSize: '0.8rem'}}>Lớp Nhóm ({post.maxStudents || 10} học viên)</span>
                    ) : (
                      <span className="badge" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', fontSize: '0.8rem'}}>Kèm 1-1</span>
                    )}
                  </div>
                  <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.9rem', flexWrap: 'wrap'}}>
                    <span style={{background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>Môn: {post.subject}</span>
                    <span style={{background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>Học phí: {post.price}</span>
                    <span style={{background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>Khu vực: {post.format}</span>
                  </div>
                  <div className="flex-center" style={{gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', justifyContent: 'flex-start'}}>
                    <button className="btn btn-primary flex-center" onClick={() => handleApproveTutor(post.id)} style={{gap: '0.5rem', background: '#10B981'}}><CheckCircle size={18} /> Phê duyệt (Công khai)</button>
                    <button className="btn btn-outline flex-center" onClick={() => handleRejectTutor(post.id)} style={{gap: '0.5rem', color: '#DC2626', borderColor: '#DC2626'}}><XCircle size={18} /> Từ chối</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 style={{color: '#D94625', marginBottom: '1.5rem'}}>Hệ thống Cảnh báo tự động & User Report</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem'}}>
                <div className="flex-between">
                  <span className="badge badge-restricted">Banned Word Filter</span>
                  <span className="text-muted" style={{fontSize: '0.85rem'}}>10 phút trước</span>
                </div>
                <p style={{marginTop: '0.5rem', fontWeight: 600}}>Bình luận vi phạm từ user: <span style={{color: 'var(--primary)'}}>HieuThứ3</span></p>
                <p style={{marginTop: '0.5rem', color: 'var(--text-main)', fontStyle: 'italic', background: 'white', padding: '0.5rem', borderRadius: '4px'}}>
                  "Giáo viên gì mà dạy *** quá vây..."
                </p>
                <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
                  <button className="btn btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>Ẩn/Xóa bình luận</button>
                  <button className="btn btn-outline text-danger" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>Ban tài khoản</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
           <h2 style={{color: '#D94625', marginBottom: '1.5rem'}}>Quản lý Người dùng</h2>
           /* Giữ nguyên logic Users nếu cần, tuy nhiên vì là mock nên ta chỉ hiển thị title */
        )}
      </main>
    </div>
  );
}

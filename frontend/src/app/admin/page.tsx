"use client";
import { Users, AlertTriangle, FileText, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import './admin.css';
import { useState, useEffect } from 'react';
import { fetchPosts, changePostStatus, fetchAllUsers, updateUserRole, deleteUser, fetchReports, updateReportStatus } from '@/lib/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [pendingTutorPosts, setPendingTutorPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'posts') loadPendingPosts();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'reports') loadReports();
  }, [activeTab]);

  const loadPendingPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const studentRes = await fetchPosts('student');
      const tutorRes = await fetchPosts('tutor');
      setPendingPosts((studentRes.data || []).filter((p: any) => p.status === 'Chờ duyệt'));
      setPendingTutorPosts((tutorRes.data || []).filter((p: any) => p.status === 'Chờ duyệt'));
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách bài đăng.');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAllUsers();
      setUsers(res.data || []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchReports('pending');
      setReports(res.data || []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải báo cáo.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await changePostStatus(id, 'Đang tìm gia sư');
      setPendingPosts((current) => current.filter((post) => post.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Không thể phê duyệt bài đăng.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await changePostStatus(id, 'Bị từ chối');
      setPendingPosts((current) => current.filter((post) => post.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Không thể từ chối bài đăng.');
    }
  };

  const handleApproveTutor = async (id: number) => {
    try {
      await changePostStatus(id, 'Đang hiển thị');
      setPendingTutorPosts((current) => current.filter((post) => post.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Không thể phê duyệt bài đăng.');
    }
  };

  const handleRejectTutor = async (id: number) => {
    try {
      await changePostStatus(id, 'Bị từ chối');
      setPendingTutorPosts((current) => current.filter((post) => post.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Không thể từ chối bài đăng.');
    }
  };

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await updateUserRole(userId, role);
      loadUsers();
    } catch (err: any) {
      alert(err?.message || 'Không thể đổi vai trò.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Xóa người dùng này?')) return;
    try {
      await deleteUser(userId);
      setUsers((current) => current.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err?.message || 'Không thể xóa người dùng.');
    }
  };

  const handleResolveReport = async (id: number, status: 'resolved' | 'dismissed') => {
    try {
      await updateReportStatus(id, status);
      setReports((current) => current.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Không thể cập nhật báo cáo.');
    }
  };

  return (
    <div className="container admin-layout">
      <aside className="admin-sidebar glass card">
        <h2 style={{ color: '#D94625', marginBottom: '2rem' }}>Admin Portal</h2>
        <nav className="dashboard-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'users', icon: Users, label: 'Quản lý Người dùng' },
            { id: 'posts', icon: FileText, label: 'Duyệt Bài đăng mới' },
            { id: 'reports', icon: AlertTriangle, label: 'Báo cáo & Cờ lọc' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ width: '100%', background: activeTab === tab.id ? 'rgba(249, 115, 22, 0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' }}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main card glass">
        {error && <div style={{ color: '#DC2626', marginBottom: '1rem' }}>{error}</div>}
        {loading && <p className="text-muted">Đang tải...</p>}

        {activeTab === 'posts' && !loading && (
          <div>
            <h2 style={{ color: '#D94625', marginBottom: '1.5rem' }}>Duyệt bài đăng của Học sinh (Hàng chờ: {pendingPosts.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {pendingPosts.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Không có bài đăng nào cần duyệt.</p>
              ) : pendingPosts.map((post) => (
                <div key={post.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'white' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                    <span>Môn: {post.subject}</span>
                    <span>Lương: {post.price}</span>
                    <span>Khu vực: {post.format}</span>
                  </div>
                  <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
                    <button className="btn btn-primary flex-center" onClick={() => handleApprove(post.id)} style={{ gap: '0.5rem', background: '#10B981' }}><CheckCircle size={18} /> Phê duyệt</button>
                    <button className="btn btn-outline flex-center" onClick={() => handleReject(post.id)} style={{ gap: '0.5rem', color: '#DC2626', borderColor: '#DC2626' }}><XCircle size={18} /> Từ chối</button>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ color: '#D94625', marginBottom: '1.5rem' }}>Duyệt quảng cáo Gia sư (Hàng chờ: {pendingTutorPosts.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {pendingTutorPosts.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Không có bài quảng cáo Gia sư nào cần duyệt.</p>
              ) : pendingTutorPosts.map((post) => (
                <div key={post.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'white' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                    <span>Môn: {post.subject}</span>
                    <span>Học phí: {post.price}</span>
                  </div>
                  <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
                    <button className="btn btn-primary flex-center" onClick={() => handleApproveTutor(post.id)} style={{ gap: '0.5rem', background: '#10B981' }}><CheckCircle size={18} /> Phê duyệt</button>
                    <button className="btn btn-outline flex-center" onClick={() => handleRejectTutor(post.id)} style={{ gap: '0.5rem', color: '#DC2626', borderColor: '#DC2626' }}><XCircle size={18} /> Từ chối</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && !loading && (
          <div>
            <h2 style={{ color: '#D94625', marginBottom: '1.5rem' }}>Quản lý Người dùng ({users.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {users.map((u) => (
                <div key={u.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong>{u.name}</strong>
                    <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>{u.email}</p>
                  </div>
                  <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <select className="input-field" style={{ width: 'auto' }} value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                      <option value="student">Học sinh</option>
                      <option value="tutor">Gia sư</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button className="btn btn-outline" style={{ color: '#DC2626', borderColor: '#DC2626' }} onClick={() => handleDeleteUser(u.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && !loading && (
          <div>
            <h2 style={{ color: '#D94625', marginBottom: '1.5rem' }}>Báo cáo chờ xử lý ({reports.length})</h2>
            {reports.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Không có báo cáo nào cần xử lý.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reports.map((report) => (
                  <div key={report.id} style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div className="flex-between">
                      <span className="badge badge-restricted">{report.target_type} #{report.target_id}</span>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>{new Date(report.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Báo cáo bởi: {report.reporter_name || 'Ẩn danh'}</p>
                    {report.reason && <p style={{ marginTop: '0.25rem' }}>Lý do: {report.reason}</p>}
                    <p style={{ marginTop: '0.5rem', fontStyle: 'italic', background: 'white', padding: '0.5rem', borderRadius: '4px' }}>{report.content}</p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleResolveReport(report.id, 'resolved')}>Đã xử lý</button>
                      <button className="btn btn-outline text-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleResolveReport(report.id, 'dismissed')}>Bỏ qua</button>
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

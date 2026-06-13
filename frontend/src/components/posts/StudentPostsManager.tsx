"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit3, Trash2, Eye, UserCheck, XCircle } from 'lucide-react';
import { SUBJECTS, GRADES, FORMATS } from '@/lib/constants';
import ComboBox from '@/components/common/ComboBox';
import { useAuth } from '@/context/AuthContext';
import { fetchMyPosts, createPost, updatePost, deletePost, fetchApplicationsForPost } from '@/lib/api';
import Link from 'next/link';

export default function StudentPostsManager() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newFormat, setNewFormat] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'full' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadPosts = async () => {
    setLoadingPosts(true);
    setError('');
    try {
      const res = await fetchMyPosts();
      setPosts(res.data || []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải bài đăng.');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleOpenEdit = (post: any) => {
    setEditingPostId(post.id);
    setNewTitle(post.title || '');
    setNewSubject(post.subject || '');
    setNewGrade(post.grade || '');
    setNewFormat(post.format || '');
    setNewPrice(post.price === 'Thỏa thuận' ? '' : String(post.price).replace(/\D/g, ''));
    setNewDesc(post.description || '');
    setErrors({});
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingPostId(null);
    setNewTitle('');
    setNewSubject('');
    setNewGrade('');
    setNewFormat('');
    setNewPrice('');
    setNewDesc('');
    setErrors({});
    setShowModal(true);
  };

  const handleSubmitPost = async () => {
    if (!user) { alert('Vui lòng đăng nhập.'); return; }

    const newErrors: Record<string, string> = {};
    if (!newTitle.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề bài đăng!';
    }
    if (!newSubject) {
      newErrors.subject = 'Vui lòng chọn môn học!';
    }
    if (!newGrade) {
      newErrors.grade = 'Vui lòng chọn lớp / cấp học!';
    }
    if (!newFormat) {
      newErrors.format = 'Vui lòng chọn hình thức học!';
    }
    
    if (!newPrice.trim()) {
      newErrors.price = 'Vui lòng nhập học phí dự kiến!';
    } else {
      const p = Number(newPrice);
      if (isNaN(p) || p <= 0) {
        newErrors.price = 'Học phí phải là số dương lớn hơn 0!';
      }
    }
    
    if (!newDesc.trim()) {
      newErrors.desc = 'Vui lòng nhập yêu cầu đối với Gia sư!';
    } else if (newDesc.trim().length < 20) {
      newErrors.desc = 'Yêu cầu đối với Gia sư phải dài ít nhất 20 ký tự!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const postData = {
      type: 'student', title: newTitle, status: 'Chờ duyệt',
      subject: newSubject, grade: newGrade,
      price: newPrice ? `${parseInt(newPrice, 10).toLocaleString('vi-VN')}đ/giờ` : 'Thỏa thuận',
      format: newFormat, description: newDesc,
    };
    try {
      if (editingPostId) {
        await updatePost(editingPostId, postData);
        alert('Cập nhật thành công! Bài đang chờ Admin duyệt lại.');
      } else {
        await createPost(postData);
        alert('Tạo bài đăng thành công! Bài đang chờ Admin duyệt.');
      }
      await loadPosts();
      setShowModal(false);
    } catch (err: any) {
      alert(err?.message || 'Lỗi khi lưu bài đăng.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Lỗi khi xóa bài đăng.');
    }
  };

  const handleViewApplicants = async (post: any) => {
    setSelectedPost(post);
    setApplicants([]);
    setLoadingApplicants(true);
    setShowApplicantsModal(true);
    try {
      const res = await fetchApplicationsForPost(post.id);
      setApplicants(res.data || []);
    } catch {
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const tabFiltered = posts.filter(p => {
    if (!p) return false;
    if (activeTab === 'active') return p.status === 'Đang tìm gia sư';
    if (activeTab === 'full') return p.status === 'Đã đủ người';
    if (activeTab === 'pending') return p.status === 'Chờ duyệt';
    return true;
  });
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? tabFiltered.filter(p => (p.title || '').toLowerCase().includes(q) || (p.subject || '').toLowerCase().includes(q))
    : tabFiltered;

  const tabBtnStyle = (key: string) => ({
    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '0.5rem 0',
    color: activeTab === key ? 'var(--primary)' : 'var(--text-muted)',
    borderBottom: activeTab === key ? '2px solid var(--primary)' : '2px solid transparent',
  } as React.CSSProperties);

  const badgeStyle = (status: string) => {
    if (status === 'Đang tìm gia sư') return { background: 'rgba(16,185,129,0.12)', color: '#10B981' };
    if (status === 'Chờ duyệt') return { background: 'rgba(245,158,11,0.12)', color: '#D97706' };
    return { background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' };
  };

  return (
    <div className="posts-container">
      <div className="posts-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#D94625', fontSize: '1.6rem', marginBottom: '0.25rem' }}>Quản lý Bài đăng Tìm Gia sư</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đăng yêu cầu lớp học để gia sư có thể ứng tuyển.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleOpenCreate}>
          <PlusCircle size={18} /> Tạo bài đăng mới
        </button>
      </div>

      <div className="card glass" style={{ padding: '1.25rem' }}>
        {/* Tabs + Search */}
        <div className="posts-toolbar" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button style={tabBtnStyle('all')} onClick={() => setActiveTab('all')}>Tất cả ({posts.length})</button>
            <button style={tabBtnStyle('active')} onClick={() => setActiveTab('active')}>Đang tìm ({posts.filter(p => p?.status === 'Đang tìm gia sư').length})</button>
            <button style={tabBtnStyle('full')} onClick={() => setActiveTab('full')}>Đã đủ người ({posts.filter(p => p?.status === 'Đã đủ người').length})</button>
            <button style={tabBtnStyle('pending')} onClick={() => setActiveTab('pending')}>Chờ duyệt ({posts.filter(p => p?.status === 'Chờ duyệt').length})</button>
          </div>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', width: '220px' }}>
            <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
          </div>
        </div>

        {loadingPosts && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải bài đăng...</p>}
        {error && <p style={{ textAlign: 'center', padding: '2rem', color: '#DC2626' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!loadingPosts && !error && filtered.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              {q ? `Không tìm thấy bài nào khớp "${searchQuery}"` : 'Không có bài đăng nào.'}
            </p>
          ) : filtered.map(post => (
            <div key={post.id} className="post-item" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ padding: '0.2rem 0.65rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, ...badgeStyle(post.status) }}>
                    {post.status}
                  </span>
                  <h3 style={{ marginTop: '0.5rem', color: 'var(--text-main)', fontSize: '1.05rem' }}>{post.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <button title="Sửa bài" onClick={() => handleOpenEdit(post)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit3 size={17} /></button>
                  <button title="Xóa bài" onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}><Trash2 size={17} /></button>
                </div>
              </div>
              <div className="post-details" style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.75rem 0', flexWrap: 'wrap' }}>
                <span><strong>Môn học:</strong> {post.subject}</span>
                <span><strong>Mức lương:</strong> {post.price}</span>
                <span><strong>Hình thức:</strong> {post.format}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(253,186,116,0.3)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{post.time}</span>
                {post.tutor ? (
                  <span style={{ color: '#10B981', fontWeight: 600 }}>Đã chọn gia sư: {post.tutor}</span>
                ) : post.applicants > 0 ? (
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                    onClick={() => handleViewApplicants(post)}>
                    <UserCheck size={16} /> Xem ứng tuyển ({post.applicants} người)
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có ứng viên</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#D94625' }}>{editingPostId ? 'Sửa bài đăng' : 'Tạo bài đăng Tìm Gia sư'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Tiêu đề bài đăng <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  className={`input-field ${errors.title ? 'input-error' : ''}`}
                  placeholder="Ví dụ: Tìm gia sư Toán lớp 10..."
                  value={newTitle}
                  onChange={e => {
                    setNewTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                />
                {errors.title && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.title}</p>}
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Môn học <span style={{ color: '#EF4444' }}>*</span></label>
                  <ComboBox
                    options={SUBJECTS}
                    placeholder="Chọn môn học..."
                    value={newSubject}
                    inputClassName={`input-field ${errors.subject ? 'input-error' : ''}`}
                    onChange={val => {
                      setNewSubject(val);
                      if (errors.subject) setErrors(prev => ({ ...prev, subject: '' }));
                    }}
                  />
                  {errors.subject && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.subject}</p>}
                </div>
                <div className="form-group">
                  <label>Lớp / Cấp học <span style={{ color: '#EF4444' }}>*</span></label>
                  <ComboBox
                    options={GRADES}
                    placeholder="Chọn lớp..."
                    value={newGrade}
                    inputClassName={`input-field ${errors.grade ? 'input-error' : ''}`}
                    onChange={val => {
                      setNewGrade(val);
                      if (errors.grade) setErrors(prev => ({ ...prev, grade: '' }));
                    }}
                  />
                  {errors.grade && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.grade}</p>}
                </div>
              </div>
              <div className="form-group">
                <label>Hình thức học <span style={{ color: '#EF4444' }}>*</span></label>
                <ComboBox
                  options={FORMATS}
                  placeholder="Chọn hình thức..."
                  value={newFormat}
                  inputClassName={`input-field ${errors.format ? 'input-error' : ''}`}
                  onChange={val => {
                    setNewFormat(val);
                    if (errors.format) setErrors(prev => ({ ...prev, format: '' }));
                  }}
                />
                {errors.format && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.format}</p>}
              </div>
              <div className="form-group">
                <label>Học phí dự kiến (VNĐ/giờ) <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  className={`input-field ${errors.price ? 'input-error' : ''}`}
                  placeholder="Ví dụ: 150000"
                  value={newPrice}
                  onChange={e => {
                    setNewPrice(e.target.value);
                    if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                  }}
                />
                {errors.price && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.price}</p>}
              </div>
              <div className="form-group">
                <label>Yêu cầu thêm đối với Gia sư <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea
                  className={`input-field ${errors.desc ? 'input-error' : ''}`}
                  rows={4}
                  placeholder="Ví dụ: Cần gia sư có kinh nghiệm ít nhất 1 năm..."
                  style={{ resize: 'vertical' }}
                  value={newDesc}
                  onChange={e => {
                    setNewDesc(e.target.value);
                    if (errors.desc) setErrors(prev => ({ ...prev, desc: '' }));
                  }}
                />
                {errors.desc && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.desc}</p>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitPost}>{editingPostId ? 'Lưu thay đổi' : 'Đăng bài (Chờ duyệt)'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && selectedPost && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ width: '100%', maxWidth: '520px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: '#D94625', marginBottom: '0.25rem' }}>Gia sư ứng tuyển</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{selectedPost.title}</p>
              </div>
              <button onClick={() => setShowApplicantsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            {loadingApplicants ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</p>
            ) : applicants.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Chưa có gia sư nào ứng tuyển.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {applicants.map((app: any) => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                        {(app.student_name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.student_name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Ứng tuyển {new Date(app.created_at || Date.now()).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <Link href={`/tutors/${app.student_id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                      Xem Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

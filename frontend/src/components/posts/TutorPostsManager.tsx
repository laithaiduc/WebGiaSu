"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, Search, Clock, Users, Edit, Trash2, XCircle } from 'lucide-react';
import { SUBJECTS, GRADES, FORMATS } from '@/lib/constants';
import ComboBox from '@/components/common/ComboBox';
import { useAuth } from '@/context/AuthContext';
import { fetchMyPosts, createPost, updatePost, deletePost, fetchApplicationsForPost } from '@/lib/api';
import Link from 'next/link';

function normalizePost(row: any) {
  return {
    ...row,
    desc: row.description ?? row.desc ?? '',
    classType: row.classType ?? row.class_type ?? '',
    maxStudents: row.maxStudents ?? row.max_students ?? 1,
    registeredStudents: row.registeredStudents ?? row.registered_students ?? 0,
    applicants: row.applicants ?? 0,
    authorName: row.author_name ?? row.authorName ?? '',
  };
}

export default function TutorPostsManager() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newFormat, setNewFormat] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [classType, setClassType] = useState('1-on-1');
  const [maxStudents, setMaxStudents] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'showing' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Applicants modal
  const [applicantsPost, setApplicantsPost] = useState<any | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await fetchMyPosts();
      setPosts((res.data || []).map(normalizePost));
    } catch (err) {
      console.error('Failed to load posts', err);
    }
  }

  const handleOpenEdit = (post: any) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewSubject(post.subject || '');
    setNewGrade(post.grade || '');
    setNewFormat(post.format || '');
    setNewPrice(post.price === 'Thỏa thuận' ? '' : String(post.price).replace(/\D/g, ''));
    setNewDesc(post.desc || '');
    setClassType(post.classType || '1-on-1');
    setMaxStudents(post.maxStudents || '');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPostId(null);
    setNewTitle('');
    setNewSubject('');
    setNewGrade('');
    setNewFormat('');
    setNewPrice('');
    setNewDesc('');
    setClassType('1-on-1');
    setMaxStudents('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmitPost = async () => {
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
      newErrors.price = 'Vui lòng nhập học phí đề xuất!';
    } else {
      const p = Number(newPrice);
      if (isNaN(p) || p <= 0) {
        newErrors.price = 'Học phí phải là số dương lớn hơn 0!';
      }
    }
    
    if (classType === 'group') {
      if (!maxStudents.toString().trim()) {
        newErrors.maxStudents = 'Vui lòng nhập số học viên tối đa!';
      } else {
        const num = Number(maxStudents);
        if (isNaN(num) || num <= 1) {
          newErrors.maxStudents = 'Số học viên tối đa phải lớn hơn 1!';
        }
      }
    }
    
    if (!newDesc.trim()) {
      newErrors.desc = 'Vui lòng nhập chi tiết nội dung giảng dạy!';
    } else if (newDesc.trim().length < 20) {
      newErrors.desc = 'Nội dung chi tiết phải dài ít nhất 20 ký tự!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const postData = {
      title: newTitle,
      status: 'Chờ duyệt',
      subject: newSubject,
      grade: newGrade,
      format: newFormat,
      price: newPrice ? `${parseInt(newPrice).toLocaleString('vi-VN')}đ/giờ` : 'Thỏa thuận',
      type: 'tutor',
      description: newDesc,
      classType,
      maxStudents: classType === 'group' ? (parseInt(maxStudents) || 10) : 1,
    };
    try {
      if (editingPostId) {
        await updatePost(editingPostId, postData);
        alert('Cập nhật bài đăng thành công! Đang chờ Admin duyệt lại.');
      } else {
        await createPost(postData);
        alert('Tạo bài đăng thành công! Đang chờ Admin duyệt.');
      }
      await loadPosts();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu bài đăng');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bài đăng');
    }
  };

  const handleViewApplicants = async (post: any) => {
    setApplicantsPost(post);
    setApplicants([]);
    setLoadingApplicants(true);
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
    if (activeTab === 'showing') return p.status === 'Đang hiển thị';
    if (activeTab === 'pending') return p.status === 'Chờ duyệt';
    return true;
  });
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? tabFiltered.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.subject || '').toLowerCase().includes(q)
      )
    : tabFiltered;

  const tabStyle = (key: string) => ({
    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
    color: activeTab === key ? 'var(--primary)' : 'var(--text-muted)',
    borderBottom: activeTab === key ? '2px solid var(--primary)' : '2px solid transparent',
    paddingBottom: '0.5rem',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#D94625', fontSize: '1.6rem', marginBottom: '0.25rem' }}>Quản lý Bài đăng Tuyển Sinh</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đăng quảng bá lớp học để học sinh dễ dàng tìm thấy và đăng ký.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleOpenCreate}>
          <PlusCircle size={18} /> Tạo bài đăng
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="card glass" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button style={tabStyle('all')} onClick={() => setActiveTab('all')}>Tất cả ({posts.length})</button>
          <button style={tabStyle('showing')} onClick={() => setActiveTab('showing')}>Đang hiển thị ({posts.filter(p => p.status === 'Đang hiển thị').length})</button>
          <button style={tabStyle('pending')} onClick={() => setActiveTab('pending')}>Chờ duyệt ({posts.filter(p => p.status === 'Chờ duyệt').length})</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem', width: '220px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '0.9rem' }} />
        </div>
      </div>

      {/* Posts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>{q ? `Không tìm thấy bài nào khớp "${searchQuery}"` : 'Bạn chưa có bài đăng nào.'}</p>
          </div>
        ) : filtered.map(post => (
          <div key={post.id} className="card glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{
                  padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600,
                  background: post.status === 'Chờ duyệt' ? 'rgba(245,158,11,0.12)' : post.status === 'Đang hiển thị' ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.05)',
                  color: post.status === 'Chờ duyệt' ? '#D97706' : post.status === 'Đang hiển thị' ? '#10B981' : 'var(--text-muted)',
                }}>{post.status}</span>
                {post.classType === 'group'
                  ? <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>Lớp Nhóm ({post.registeredStudents}/{post.maxStudents})</span>
                  : <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>Kèm 1-1</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => handleOpenEdit(post)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit size={17} /></button>
                <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}><Trash2 size={17} /></button>
              </div>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>{post.title}</h3>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {post.time || 'Mới đăng'}</span>
              <span><strong>Môn:</strong> {post.subject}</span>
              <span><strong>Hình thức:</strong> {post.format}</span>
              <span><strong>Học phí:</strong> {post.price}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Users size={16} /> {post.applicants} học sinh quan tâm
              </span>
              {post.applicants > 0 && (
                <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={() => handleViewApplicants(post)}>
                  Xem danh sách học sinh ({post.applicants})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#D94625' }}>{editingPostId ? 'Sửa bài đăng' : 'Tạo bài đăng Tuyển Sinh'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Tiêu đề lớp học <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  className={`input-field ${errors.title ? 'input-error' : ''}`}
                  placeholder="Ví dụ: Luyện thi IELTS mục tiêu 7.0"
                  value={newTitle}
                  onChange={e => {
                    setNewTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                />
                {errors.title && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.title}</p>}
              </div>
              <div className="form-group">
                <label>Loại hình</label>
                <div style={{ display: 'flex', gap: '2rem', padding: '0.25rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="ct" checked={classType === '1-on-1'} onChange={() => {
                      setClassType('1-on-1');
                      if (errors.maxStudents) setErrors(prev => ({ ...prev, maxStudents: '' }));
                    }} style={{ accentColor: 'var(--primary)' }} /> Dạy kèm 1-1
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="ct" checked={classType === 'group'} onChange={() => setClassType('group')} style={{ accentColor: 'var(--primary)' }} /> Mở lớp nhóm
                  </label>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: classType === 'group' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Học phí đề xuất (VNĐ/giờ) <span style={{ color: '#EF4444' }}>*</span></label>
                  <input
                    type="number"
                    className={`input-field ${errors.price ? 'input-error' : ''}`}
                    placeholder="Ví dụ: 200000"
                    value={newPrice}
                    onChange={e => {
                      setNewPrice(e.target.value);
                      if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                    }}
                  />
                  {errors.price && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.price}</p>}
                </div>
                {classType === 'group' && (
                  <div className="form-group">
                    <label>Số học viên tối đa <span style={{ color: '#EF4444' }}>*</span></label>
                    <input
                      type="number"
                      className={`input-field ${errors.maxStudents ? 'input-error' : ''}`}
                      placeholder="Ví dụ: 10"
                      value={maxStudents}
                      onChange={e => {
                        setMaxStudents(e.target.value);
                        if (errors.maxStudents) setErrors(prev => ({ ...prev, maxStudents: '' }));
                      }}
                    />
                    {errors.maxStudents && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.maxStudents}</p>}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Chi tiết nội dung giảng dạy <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea
                  className={`input-field ${errors.desc ? 'input-error' : ''}`}
                  rows={4}
                  placeholder="Mô tả lộ trình, phương pháp, kết quả cam kết..."
                  value={newDesc}
                  onChange={e => {
                    setNewDesc(e.target.value);
                    if (errors.desc) setErrors(prev => ({ ...prev, desc: '' }));
                  }}
                  style={{ resize: 'vertical' }}
                />
                {errors.desc && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.desc}</p>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitPost}>{editingPostId ? 'Lưu thay đổi' : 'Đăng bài (Chờ duyệt)'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {applicantsPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: '#D94625', marginBottom: '0.25rem' }}>Học sinh ứng tuyển</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{applicantsPost.title}</p>
              </div>
              <button onClick={() => setApplicantsPost(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            {loadingApplicants ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</p>
            ) : applicants.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Chưa có học sinh nào ứng tuyển.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {applicants.map((app: any) => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                        {(app.student_name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.student_name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Ứng tuyển {new Date(app.created_at || Date.now()).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <Link href={`/students/${app.student_id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', textDecoration: 'none' }}>
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

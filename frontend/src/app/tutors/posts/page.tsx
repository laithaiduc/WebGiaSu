"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, Search, Clock, Users, Edit, Trash2, XCircle } from 'lucide-react';
import '../../students/posts/posts.css';
import { SUBJECTS, GRADES, FORMATS } from '@/lib/constants';
import ComboBox from '@/components/common/ComboBox';
import { useAuth } from '@/context/AuthContext';
import { fetchPosts, createPost, updatePost, deletePost } from '@/lib/api';

export default function TutorPosts() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [posts, setPosts] = useState<any[]>([]);

  function normalizePost(row: any) {
    return {
      ...row,
      desc: row.description ?? row.desc ?? '',
      classType: row.classType ?? row.class_type ?? row.class_type,
      maxStudents: row.maxStudents ?? row.max_students ?? row.max_students,
      registeredStudents: row.registeredStudents ?? row.registered_students ?? 0,
      applicants: row.applicants ?? 0,
      authorName: row.author_name ?? row.authorName ?? row.authorName,
    };
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchPosts('tutor');
        const rows = res.data || [];
        setPosts(rows.map(normalizePost));
      } catch (err) {
        console.error('Failed to load posts', err);
      }
    })();
  }, []);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(SUBJECTS[0]);
  const [newGrade, setNewGrade] = useState(GRADES[0]);
  const [newFormat, setNewFormat] = useState(FORMATS[0]);
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [classType, setClassType] = useState('1-on-1'); // '1-on-1' or 'group'
  const [maxStudents, setMaxStudents] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'showing' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenEdit = (post: any) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewSubject(post.subject);
    setNewGrade(post.grade || GRADES[0]);
    setNewFormat(post.format);
    setNewPrice(post.price === 'Thỏa thuận' ? '' : String(post.price).replace(/\D/g, ''));
    setNewDesc(post.desc || '');
    setClassType(post.classType || '1-on-1');
    setMaxStudents(post.maxStudents || '');
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPostId(null);
    setNewTitle('');
    setNewGrade(GRADES[0]);
    setNewPrice('');
    setNewDesc('');
    setClassType('1-on-1');
    setMaxStudents('');
    setIsModalOpen(true);
  };

  const handleSubmitPost = () => {
    if (!newTitle.trim()) {
      alert("Vui lòng nhập tiêu đề!");
      return;
    }
    const currentName = user?.name || "Gia sư ẩn danh";
    const postData = {
      title: newTitle,
      status: "Chờ duyệt",
      subject: newSubject,
      grade: newGrade,
      format: newFormat,
      price: newPrice ? `${parseInt(newPrice).toLocaleString('vi-VN')}đ/buổi` : "Thỏa thuận",
      // backend will fill author info and timestamps
      type: 'tutor',
      description: newDesc,
      classType: classType,
      maxStudents: classType === 'group' ? (parseInt(maxStudents) || 10) : 1,
    };
    (async () => {
      try {
        if (editingPostId) {
          await updatePost(editingPostId, postData);
          // Reload from server to get fresh data
          const refreshed = await fetchPosts('tutor');
          setPosts((refreshed.data || []).map(normalizePost));
          alert('Cập nhật bài đăng thành công! Đang chờ Admin duyệt lại.');
        } else {
          const res = await createPost(postData);
          const created = normalizePost(res.data);
          setPosts([created, ...posts]);
          alert('Tạo bài đăng thành công! Đang chờ Admin duyệt.');
        }
        setIsModalOpen(false);
      } catch (err: any) {
        alert(err.message || 'Lỗi khi lưu bài đăng');
      }
    })();
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) {
      (async () => {
        try {
          await deletePost(id);
          setPosts(posts.filter(p => p.id !== id));
        } catch (err: any) {
          alert(err.message || 'Lỗi khi xóa bài đăng');
        }
      })();
    }
  };

  return (
    <div className="container" style={{paddingTop: '2rem', paddingBottom: '4rem'}}>
      <div className="flex-between" style={{marginBottom: '2rem'}}>
        <div>
          <h1 style={{color: '#D94625', fontSize: '2rem', marginBottom: '0.5rem'}}>Quản lý Bài đăng Tuyển Sinh</h1>
          <p className="text-muted">Đăng quảng bá lớp học của bạn để học sinh dễ dàng tìm thấy và đăng ký.</p>
        </div>
        <button className="btn btn-primary flex-center" style={{gap: '0.5rem'}} onClick={handleOpenCreate}>
          <PlusCircle size={20} /> Tạo bài đăng mới
        </button>
      </div>

      <div className="card glass flex-between" style={{marginBottom: '2rem', padding: '1rem', flexWrap: 'wrap', gap: '1rem'}}>
        <div className="flex-center" style={{gap: '2rem'}}>
          <button
            onClick={() => setActiveTab('all')}
            style={{background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
              color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'all' ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '0.5rem'}}
          >Tất cả ({posts.length})</button>
          <button
            onClick={() => setActiveTab('showing')}
            style={{background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
              color: activeTab === 'showing' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'showing' ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '0.5rem'}}
          >Đang hiển thị ({posts.filter(p => p.status === 'Đang hiển thị').length})</button>
          <button
            onClick={() => setActiveTab('pending')}
            style={{background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
              color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '0.5rem'}}
          >Chờ duyệt ({posts.filter(p => p.status === 'Chờ duyệt').length})</button>
        </div>
        <div className="input-with-icon" style={{width: '250px'}}>
          <Search className="input-icon" size={18} />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm kiếm bài đăng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        {(() => {
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

          if (filtered.length === 0) return (
            <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
              <p>{q ? `Không tìm thấy bài nào khớp “${searchQuery}”` : 'Bạn chưa có bài đăng nào.'}</p>
            </div>
          );

          return filtered.map(post => (
          <div key={post.id} className="card glass post-item">
            <div className="flex-between" style={{marginBottom: '1rem'}}>
              <div className="flex-center" style={{gap: '1rem'}}>
                <span className="status-badge" style={post.status === 'Chờ duyệt' ? {background: 'rgba(245, 158, 11, 0.1)', color: '#D97706'} : post.status === 'Đang hiển thị' ? {background: 'rgba(16, 185, 129, 0.1)', color: '#10B981'} : {background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)'}}>
                  {post.status}
                </span>
                {post.classType === 'group' ? (
                  <span className="badge" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6'}}>Lớp Nhóm ({post.registeredStudents || 0}/{post.maxStudents || 10})</span>
                ) : (
                  <span className="badge" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6'}}>Kèm 1-1</span>
                )}
              </div>
              <div className="flex-center" style={{gap: '1rem'}}>
                <button className="text-muted" onClick={() => handleOpenEdit(post)} style={{background:'none', border:'none', cursor:'pointer'}}><Edit size={18}/></button>
                <button className="text-muted" onClick={() => handleDelete(post.id)} style={{background:'none', border:'none', cursor:'pointer', color: '#DC2626'}}><Trash2 size={18}/></button>
              </div>
            </div>
            
            <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>{post.title}</h2>
            
            <div style={{display: 'flex', gap: '2rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap'}}>
              <span className="flex-center" style={{gap: '0.5rem'}}><Clock size={16}/> {post.time}</span>
              <span className="flex-center" style={{gap: '0.5rem'}}><strong>Môn:</strong> {post.subject}</span>
              <span className="flex-center" style={{gap: '0.5rem'}}><strong>Hình thức:</strong> {post.format}</span>
              <span className="flex-center" style={{gap: '0.5rem'}}><strong>Học phí:</strong> {post.price}</span>
            </div>

            <div className="flex-between" style={{borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
              <span className="flex-center text-muted" style={{gap: '0.5rem'}}><Users size={18}/> {post.applicants} Học sinh quan tâm</span>
              {post.applicants > 0 && <button className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>Xem danh sách Học sinh ({post.applicants})</button>}
            </div>
          </div>
          ));
        })()}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header flex-between">
              <h2>{editingPostId ? "Sửa bài đăng" : "Tạo bài đăng Tuyển Sinh"}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><XCircle size={24} /></button>
            </div>
            
            <form className="modal-form">
              <div className="form-group">
                <label>Tiêu đề lớp học</label>
                <input type="text" className="input-field" placeholder="Ví dụ: Luyện thi IELTS mục tiêu 7.0 trong 6 tháng" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Loại hình</label>
                <div className="flex-center" style={{gap: '2rem', justifyContent: 'flex-start', padding: '0.5rem 0'}}>
                  <label className="flex-center" style={{gap: '0.5rem', cursor: 'pointer'}}>
                    <input type="radio" name="classType" checked={classType === '1-on-1'} onChange={() => setClassType('1-on-1')} style={{accentColor: 'var(--primary)'}} />
                    Dạy kèm 1-1
                  </label>
                  <label className="flex-center" style={{gap: '0.5rem', cursor: 'pointer'}}>
                    <input type="radio" name="classType" checked={classType === 'group'} onChange={() => setClassType('group')} style={{accentColor: 'var(--primary)'}} />
                    Mở lớp học nhóm
                  </label>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <ComboBox
                    options={SUBJECTS}
                    placeholder="Chọn môn học..."
                    label="Môn học"
                    value={newSubject}
                    onChange={(val) => setNewSubject(val)}
                  />
                </div>
                <div className="form-group">
                  <ComboBox
                    options={GRADES}
                    placeholder="Chọn lớp..."
                    label="Lớp / Cấp học"
                    value={newGrade}
                    onChange={(val) => setNewGrade(val)}
                  />
                </div>
              </div>

              <div className="form-group">
                  <ComboBox
                    options={FORMATS}
                    placeholder="Chọn hình thức..."
                    label="Hình thức học"
                    value={newFormat}
                    onChange={(val) => setNewFormat(val)}
                  />
              </div>
              
              <div className="form-grid" style={{marginBottom: '1rem'}}>
                <div className="form-group">
                  <label>Học phí đề xuất (VNĐ/buổi)</label>
                  <input type="number" className="input-field" placeholder="Ví dụ: 200000" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                </div>
                {classType === 'group' && (
                  <div className="form-group">
                    <label>Số lượng học viên tối đa</label>
                    <input type="number" className="input-field" placeholder="Ví dụ: 10" value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} />
                  </div>
                )}
              </div>
              
              <div className="form-group" style={{marginBottom: '2rem'}}>
                <label>Chi tiết nội dung giảng dạy</label>
                <textarea className="input-field" rows={5} placeholder="Mô tả lộ trình học, phương pháp, kết quả cam kết..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)}></textarea>
              </div>
              
              <div className="flex-center" style={{justifyContent: 'flex-end', gap: '1rem'}}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitPost}>{editingPostId ? "Lưu thay đổi" : "Đăng bài (Chờ duyệt)"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

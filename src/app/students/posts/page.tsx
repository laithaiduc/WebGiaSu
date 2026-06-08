"use client";
import { PlusCircle, Search, Edit3, Trash2, Eye, UserCheck, XCircle } from 'lucide-react';
import './posts.css';
import { useState, useEffect } from 'react';
import { SUBJECTS, GRADES, FORMATS } from '@/lib/constants';
import ComboBox from '@/components/common/ComboBox';

export default function StudentPosts() {
  const [showModal, setShowModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  
  // Dynamic posts state
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Tìm gia sư Tiếng Anh giao tiếp cho người đi làm",
      status: "Đang tìm gia sư",
      subject: "Tiếng Anh",
      grade: "Người đi làm",
      price: "250.000đ/buổi",
      format: "Online",
      time: "Đăng 2 ngày trước",
      applicants: 5,
      tutor: null
    },
    {
      id: 2,
      title: "Tìm gia sư Toán lớp 10 luyện thi Học sinh giỏi",
      status: "Đã đủ người",
      subject: "Toán học",
      grade: "Lớp 10",
      price: "200.000đ/buổi",
      format: "Offline",
      time: "Đăng 1 tuần trước",
      applicants: 0,
      tutor: "Nguyễn Văn A"
    }
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('studentPosts');
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(SUBJECTS[0]);
  const [newGrade, setNewGrade] = useState(GRADES[0]);
  const [newFormat, setNewFormat] = useState(FORMATS[0]);
  const [newPrice, setNewPrice] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const handleOpenEdit = (post: any) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewSubject(post.subject);
    setNewGrade(post.grade || GRADES[0]);
    setNewFormat(post.format);
    setNewPrice(post.price === 'Thỏa thuận' ? '' : post.price.replace(/\\D/g, ''));
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingPostId(null);
    setNewTitle('');
    setNewGrade(GRADES[0]);
    setNewPrice('');
    setShowModal(true);
  };

  const handleSubmitPost = () => {
    if (!newTitle.trim()) {
      alert("Vui lòng nhập tiêu đề bài đăng!");
      return;
    }
    const currentName = localStorage.getItem('userName') || "Học sinh ẩn danh";
    const postData = {
      title: newTitle,
      status: "Chờ duyệt",
      subject: newSubject,
      grade: newGrade,
      price: newPrice ? `${parseInt(newPrice).toLocaleString('vi-VN')}đ/buổi` : "Thỏa thuận",
      format: newFormat,
      time: editingPostId ? "Vừa cập nhật" : "Vừa xong",
    };
    
    let updatedPosts;
    if (editingPostId) {
      updatedPosts = posts.map(p => p.id === editingPostId ? { ...p, ...postData } : p);
      alert("Cập nhật bài đăng thành công! Bài đăng của bạn đang chờ Admin duyệt lại.");
    } else {
      const newPost = {
        id: Date.now(),
        ...postData,
        applicants: 0,
        tutor: null,
        authorName: currentName
      };
      updatedPosts = [newPost, ...posts];
      alert("Tạo bài đăng thành công! Bài đăng của bạn đang chờ Admin duyệt.");
    }

    setPosts(updatedPosts);
    localStorage.setItem('studentPosts', JSON.stringify(updatedPosts));
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if(confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      localStorage.setItem('studentPosts', JSON.stringify(updated));
    }
  };

  return (
    <div className="container posts-container">
      <div className="page-header flex-between">
        <div>
          <h1 style={{color: '#D94625', marginBottom: '0.5rem'}}>Quản lý Bài đăng tìm Gia sư</h1>
          <p className="text-muted">Đăng yêu cầu lớp học của bạn để gia sư có thể dễ dàng ứng tuyển.</p>
        </div>
        <button className="btn btn-primary flex-center" style={{gap: '0.5rem'}} onClick={handleOpenCreate}>
          <PlusCircle size={20} /> Tạo bài đăng mới
        </button>
      </div>

      <div className="card glass">
        <div className="flex-between" style={{marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
          <div className="tab-navigation">
            <button className="tab-btn active">Tất cả ({posts.length})</button>
            <button className="tab-btn">Đang tìm ({posts.filter(p=>p.status==="Đang tìm gia sư").length})</button>
            <button className="tab-btn">Đã đủ người ({posts.filter(p=>p.status==="Đã đủ người").length})</button>
            <button className="tab-btn text-muted">Chờ duyệt ({posts.filter(p=>p.status==="Chờ duyệt").length})</button>
          </div>
          <div className="search-input-wrapper" style={{background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', width: '250px'}}>
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Tìm kiếm bài đăng..." style={{border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem'}} />
          </div>
        </div>

        <div className="posts-list">
          {posts.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
              <p>Bạn chưa có bài đăng nào.</p>
            </div>
          ) : posts.map(post => (
            <div className="post-item" key={post.id}>
              <div className="post-header flex-between">
                <div>
                  <span className={`badge ${post.status === 'Đang tìm gia sư' ? 'badge-active' : ''}`} style={post.status === 'Đã đủ người' ? {background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)'} : post.status === 'Chờ duyệt' ? {background: 'rgba(245, 158, 11, 0.1)', color: '#D97706'} : {}}>
                    {post.status}
                  </span>
                  <h3 className="post-title" style={{marginTop: '0.5rem', color: 'var(--text-main)'}}>{post.title}</h3>
                </div>
                <div className="post-actions">
                  <button className="btn-icon" title="Xem chi tiết"><Eye size={18} /></button>
                  <button className="btn-icon" title="Sửa bài" onClick={() => handleOpenEdit(post)}><Edit3 size={18} /></button>
                  <button className="btn-icon text-danger" title="Xóa bài" onClick={() => handleDelete(post.id)}><Trash2 size={18} /></button>
                </div>
              </div>
              
              <div className="post-details" style={{display: 'flex', gap: '1.5rem', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem'}}>
                <span><strong>Môn học:</strong> {post.subject}</span>
                <span><strong>Mức lương:</strong> {post.price}</span>
                <span><strong>Hình thức:</strong> {post.format}</span>
              </div>
              
              <div className="post-footer flex-between" style={{borderTop: '1px solid rgba(253, 186, 116, 0.3)', paddingTop: '1rem'}}>
                <span className="text-muted">{post.time}</span>
                {post.tutor ? (
                  <span style={{color: '#10B981', fontWeight: 600}}>Đã chọn gia sư: {post.tutor}</span>
                ) : post.applicants > 0 ? (
                  <button className="btn btn-outline flex-center" style={{gap: '0.5rem'}} onClick={() => setShowApplicantsModal(true)}>
                    <UserCheck size={18} /> Xem danh sách Ứng tuyển ({post.applicants} người)
                  </button>
                ) : (
                  <span className="text-muted" style={{fontSize: '0.9rem'}}>Chưa có ứng viên</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tạo Bài Đăng Mới */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header flex-between">
              <h2 style={{color: '#D94625'}}>{editingPostId ? "Sửa bài đăng tìm Gia sư" : "Tạo bài đăng tìm Gia sư"}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><XCircle size={24} /></button>
            </div>
            <form className="modal-body">
              <div className="form-group">
                <label>Tiêu đề bài đăng</label>
                <input type="text" className="input-field" placeholder="Ví dụ: Tìm gia sư Toán lớp 10..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="form-grid" style={{marginBottom: '1rem'}}>
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
              <div className="form-group" style={{marginBottom: '1rem'}}>
                  <ComboBox
                    options={FORMATS}
                    placeholder="Chọn hình thức..."
                    label="Hình thức học"
                    value={newFormat}
                    onChange={(val) => setNewFormat(val)}
                  />
              </div>
              <div className="form-group">
                <label>Học phí dự kiến (VNĐ/buổi)</label>
                <input type="number" className="input-field" placeholder="Ví dụ: 150000" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Yêu cầu thêm đối với Gia sư</label>
                <textarea className="input-field" rows={4} placeholder="Ví dụ: Cần gia sư là sinh viên năm 3 trở lên, có kinh nghiệm..." style={{resize: 'vertical'}}></textarea>
              </div>
              <div className="flex-center" style={{justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitPost}>{editingPostId ? "Lưu thay đổi" : "Đăng bài (Chờ duyệt)"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Danh sách Ứng tuyển */}
      {showApplicantsModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header flex-between">
              <h2 style={{color: '#D94625'}}>Gia sư đang ứng tuyển (5)</h2>
              <button className="btn-icon" onClick={() => setShowApplicantsModal(false)}><XCircle size={24} /></button>
            </div>
            <div className="modal-body" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div className="flex-between" style={{padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}>
                <div className="flex-center" style={{gap: '1rem'}}>
                  <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>N</div>
                  <div>
                    <h4 style={{marginBottom: '0.25rem', color: 'var(--text-main)'}}>Nguyễn Văn A</h4>
                    <p className="text-muted" style={{fontSize: '0.85rem'}}>Sinh viên năm 3 - ĐH Bách Khoa TP.HCM</p>
                  </div>
                </div>
                <div className="flex-center" style={{gap: '0.5rem'}}>
                  <a href="/tutors/123" target="_blank" className="btn btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem', textDecoration: 'none'}}>Xem Profile</a>
                  <button className="btn btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>Chọn Gia sư này</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

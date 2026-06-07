"use client";
import { useState } from 'react';
import { Star, MapPin, Briefcase, Award, CheckCircle, Heart, MessageCircle, X, Send } from 'lucide-react';
import CommentSection from '@/components/comments/CommentSection';
import RatingBox from '@/components/reviews/RatingBox';

export default function TutorProfilePublic() {
  const [isSaved, setIsSaved] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Chào bạn, mình có thể giúp gì cho quá trình học tập của bạn không?', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), text: inputValue, isUser: true }]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  return (
    <div className="container" style={{paddingTop: '3rem', paddingBottom: '4rem'}}>
      <div className="content-layout" style={{display: 'flex', gap: '2rem'}}>
        {/* Main Content */}
        <div style={{flex: 1}}>
          {/* Header Info */}
          <div className="card glass" style={{padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
            <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, flexShrink: 0}}>N</div>
            <div style={{flex: 1}}>
              <div className="flex-between">
                <h1 style={{color: '#D94625', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  Nguyễn Văn A <span title="Đã xác thực" style={{display: 'flex'}}><CheckCircle size={24} color="#10B981" /></span>
                </h1>
                <div className="flex-center" style={{gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 700}}>
                  <Star fill="currentColor" size={20} /> 4.9 (12 đánh giá)
                </div>
              </div>
              <p className="text-muted" style={{fontSize: '1.1rem', marginTop: '0.25rem'}}>Sinh viên năm 3 - Đại học Bách Khoa TP.HCM</p>
              
              <div style={{display: 'flex', gap: '1.5rem', marginTop: '1rem', color: 'var(--text-main)'}}>
                <span className="flex-center" style={{gap: '0.5rem'}}><MapPin size={18} className="text-muted" /> TP.HCM</span>
                <span className="flex-center" style={{gap: '0.5rem'}}><Briefcase size={18} className="text-muted" /> 3 năm kinh nghiệm</span>
              </div>
            </div>
          </div>

          <div className="card glass" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2 style={{marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Award size={24} className="text-primary" /> Giới thiệu & Kinh nghiệm</h2>
            <p style={{lineHeight: 1.7, color: 'var(--text-muted)'}}>
              Chào các bạn và quý phụ huynh! Mình là sinh viên năm 3 chuyên ngành Công nghệ thông tin tại Đại học Bách Khoa TP.HCM. 
              Mình đã có 3 năm kinh nghiệm gia sư các môn Toán và Lý cho các em học sinh cấp 2 và cấp 3.
              Phương pháp giảng dạy của mình là tập trung vào hiểu bản chất thay vì học vẹt, luôn tạo không khí học tập thoải mái. 
              Đã từng giúp 3 học sinh đỗ vào trường chuyên Trần Đại Nghĩa và Phổ thông Năng Khiếu.
            </p>
            
            <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Môn học có thể dạy</h3>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <span style={{padding: '0.5rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '2rem'}}>Toán học (Lớp 6-12)</span>
              <span style={{padding: '0.5rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '2rem'}}>Vật lý (Lớp 10-12)</span>
              <span style={{padding: '0.5rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '2rem'}}>Luyện thi Đại học (Khối A)</span>
            </div>
          </div>

          {/* Q&A Comments */}
          <div className="card glass" style={{padding: '2rem', marginBottom: '2rem'}}>
            <CommentSection />
          </div>

          {/* Reviews Section */}
          <div style={{marginTop: '2rem'}}>
             <RatingBox isLocked={true} />
             {/* Mock Review List */}
             <div className="card glass" style={{padding: '1.5rem'}}>
                <h3 style={{marginBottom: '1.5rem'}}>Nhận xét gần đây (12)</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div>
                    <div className="flex-between" style={{marginBottom: '0.25rem'}}>
                      <strong>Bé Minh (Lớp 10)</strong>
                      <div className="flex-center" style={{gap: '0.1rem', color: '#F59E0B'}}>
                        <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                      </div>
                    </div>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Anh dạy rất dễ hiểu, không bị buồn ngủ. Điểm Toán học kỳ này của em tăng 2 điểm rồi ạ.</p>
                  </div>
                  <div>
                    <div className="flex-between" style={{marginBottom: '0.25rem'}}>
                      <strong>Phụ huynh Trâm Anh</strong>
                      <div className="flex-center" style={{gap: '0.1rem', color: '#F59E0B'}}>
                        <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                      </div>
                    </div>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Gia sư rất ngoan, đúng giờ. Cách giảng bài logic.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{width: '320px', flexShrink: 0}}>
          <div className="card glass" style={{padding: '1.5rem', position: 'sticky', top: '90px'}}>
            <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
              <p className="text-muted" style={{marginBottom: '0.25rem'}}>Học phí tham khảo</p>
              <h2 style={{color: 'var(--primary)', fontSize: '2rem'}}>150.000đ<span style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>/buổi</span></h2>
            </div>
            
            <button className="btn btn-primary flex-center" style={{width: '100%', marginBottom: '1rem', padding: '0.75rem', gap: '0.5rem'}} onClick={() => setIsChatOpen(true)}>
              <MessageCircle size={18} /> Liên hệ / Đặt lớp ngay
            </button>
            <button className="btn btn-outline flex-center" style={{width: '100%', padding: '0.75rem', gap: '0.5rem', borderColor: isSaved ? '#EF4444' : '', color: isSaved ? '#EF4444' : ''}} onClick={() => setIsSaved(!isSaved)}>
              <Heart size={18} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : 'currentColor'} /> 
              {isSaved ? 'Đã lưu hồ sơ' : 'Lưu hồ sơ'}
            </button>
            
            <hr style={{margin: '1.5rem 0', border: 'none', borderTop: '1px dashed var(--border)'}} />
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div className="flex-between">
                <span className="text-muted">Hình thức dạy:</span>
                <strong>Online & Offline</strong>
              </div>
              <div className="flex-between">
                <span className="text-muted">Lượt kết nối:</span>
                <strong>24 học sinh</strong>
              </div>
              <div className="flex-between">
                <span className="text-muted">Phản hồi trung bình:</span>
                <strong>Trong 1 giờ</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Box */}
      {isChatOpen && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', width: '350px', background: 'var(--background)', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', overflow: 'hidden'}}>
          <div className="flex-between" style={{background: 'var(--primary)', color: 'white', padding: '1rem'}}>
            <div className="flex-center" style={{gap: '0.5rem'}}>
              <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>N</div>
              <div>
                <h4 style={{margin: 0, fontSize: '1rem'}}>Gia sư Nguyễn Văn A</h4>
                <p style={{margin: 0, fontSize: '0.75rem', opacity: 0.8}}>Đang hoạt động</p>
              </div>
            </div>
            <button style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}} onClick={() => setIsChatOpen(false)}><X size={20}/></button>
          </div>
          
          <div style={{height: '300px', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F9FAFB'}}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start', 
                background: msg.isUser ? 'var(--primary)' : 'white', 
                color: msg.isUser ? 'white' : 'var(--text-main)',
                padding: '0.75rem 1rem', 
                borderRadius: '1rem', 
                borderTopRightRadius: msg.isUser ? 0 : '1rem',
                borderTopLeftRadius: msg.isUser ? '1rem' : 0, 
                border: msg.isUser ? 'none' : '1px solid var(--border)', 
                maxWidth: '80%'
              }}>
                <p style={{margin: 0, fontSize: '0.9rem'}}>{msg.text}</p>
              </div>
            ))}
          </div>
          
          <div style={{padding: '0.75rem', borderTop: '1px solid var(--border)', background: 'white', display: 'flex', gap: '0.5rem'}}>
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              style={{flex: 1, padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '2rem', outline: 'none', fontSize: '0.9rem'}}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              style={{width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0}}
              onClick={handleSendMessage}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

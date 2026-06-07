"use client";
import { useState } from 'react';
import { MapPin, Target, Book, CheckCircle, Heart, MessageCircle, X, Send } from 'lucide-react';
import CommentSection from '@/components/comments/CommentSection';

export default function StudentProfilePublic() {
  const [isSaved, setIsSaved] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Chào bạn, mình là Gia sư, bạn đang cần tìm người dạy kèm môn Tiếng Anh đúng không?', isUser: false }
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
            <div style={{width: '100px', height: '100px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, flexShrink: 0}}>T</div>
            <div style={{flex: 1}}>
              <div className="flex-between">
                <h1 style={{color: '#D94625', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  Trần Học Sinh <span title="Đã xác thực" style={{display: 'flex'}}><CheckCircle size={24} color="#10B981" /></span>
                </h1>
              </div>
              <p className="text-muted" style={{fontSize: '1.1rem', marginTop: '0.25rem'}}>Học sinh Lớp 10</p>
              
              <div style={{display: 'flex', gap: '1.5rem', marginTop: '1rem', color: 'var(--text-main)'}}>
                <span className="flex-center" style={{gap: '0.5rem'}}><MapPin size={18} className="text-muted" /> Quận Bình Thạnh, TP.HCM</span>
              </div>
            </div>
          </div>

          <div className="card glass" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2 style={{marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Target size={24} className="text-primary" /> Mục tiêu & Nhu cầu học tập</h2>
            <p style={{lineHeight: 1.7, color: 'var(--text-muted)'}}>
              Mục tiêu năm nay là thi học sinh giỏi môn Tiếng Anh và duy trì điểm Toán trên 8.0. Mình rất thích cách học có nhiều hình ảnh minh họa, không khí học tập thoải mái, không quá áp lực.
              Đang cần tìm gia sư có thể đồng hành lâu dài, kiên nhẫn.
            </p>
            
            <h3 style={{marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Book size={20} className="text-primary"/> Các môn đang cần học</h3>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <span style={{padding: '0.5rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '2rem'}}>Tiếng Anh (Giao tiếp cơ bản)</span>
              <span style={{padding: '0.5rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '2rem'}}>Toán (Chương trình Lớp 10)</span>
            </div>
          </div>

          {/* Q&A Comments */}
          <div className="card glass" style={{padding: '2rem', marginBottom: '2rem'}}>
            <CommentSection />
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{width: '320px', flexShrink: 0}}>
          <div className="card glass" style={{padding: '1.5rem', position: 'sticky', top: '90px'}}>
            <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
              <p className="text-muted" style={{marginBottom: '0.25rem'}}>Học phí sẵn sàng chi trả</p>
              <h2 style={{color: 'var(--primary)', fontSize: '2rem'}}>200.000đ<span style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>/buổi</span></h2>
            </div>
            
            <button className="btn btn-primary flex-center" style={{width: '100%', marginBottom: '1rem', padding: '0.75rem', gap: '0.5rem'}} onClick={() => setIsChatOpen(true)}>
              <MessageCircle size={18} /> Liên hệ / Nhận lớp ngay
            </button>
            <button className="btn btn-outline flex-center" style={{width: '100%', padding: '0.75rem', gap: '0.5rem', borderColor: isSaved ? '#EF4444' : '', color: isSaved ? '#EF4444' : ''}} onClick={() => setIsSaved(!isSaved)}>
              <Heart size={18} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : 'currentColor'} /> 
              {isSaved ? 'Đã lưu Học sinh' : 'Lưu hồ sơ Học sinh'}
            </button>
            
            <hr style={{margin: '1.5rem 0', border: 'none', borderTop: '1px dashed var(--border)'}} />
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div className="flex-between">
                <span className="text-muted">Hình thức mong muốn:</span>
                <strong>Online hoặc Offline</strong>
              </div>
              <div className="flex-between">
                <span className="text-muted">Lịch học trống:</span>
                <strong>Tối 3-5-7</strong>
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
              <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>T</div>
              <div>
                <h4 style={{margin: 0, fontSize: '1rem'}}>Học sinh Trần</h4>
                <p style={{margin: 0, fontSize: '0.75rem', opacity: 0.8}}>Đang trực tuyến</p>
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

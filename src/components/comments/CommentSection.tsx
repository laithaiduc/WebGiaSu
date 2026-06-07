"use client";
import { useState } from 'react';
import { Send, CornerDownRight } from 'lucide-react';

export default function CommentSection() {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Mock comments
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Trần Học Sinh",
      avatar: "T",
      content: "Anh ơi lớp này học vào tối 3-5-7 được không ạ?",
      time: "2 giờ trước",
      replies: [
        {
          id: 101,
          author: "Nguyễn Văn A",
          avatar: "N",
          content: "Chào em, lịch 3-5-7 anh còn trống ca từ 19h30 - 21h nhé. Phù hợp thì em bấm liên hệ nha!",
          time: "1 giờ trước",
          isTutor: true
        }
      ]
    },
    {
      id: 2,
      author: "Phụ huynh bé Lan",
      avatar: "P",
      content: "Em có nhận dạy kèm tiếng Anh chương trình Cambridge không?",
      time: "1 ngày trước",
      replies: []
    }
  ]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "Tôi (Bạn)",
      avatar: "M",
      content: commentText,
      time: "Vừa xong",
      replies: []
    };
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      author: "Tôi (Bạn)",
      avatar: "M",
      content: replyText,
      time: "Vừa xong",
      isTutor: false
    };
    
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, newReply] };
      }
      return c;
    }));
    
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="comment-section" style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem'}}>
      <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem'}}>Hỏi đáp & Bình luận ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})</h3>
      
      {/* Input Form */}
      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>M</div>
        <div style={{flex: 1, position: 'relative'}}>
          <input 
            type="text" 
            placeholder="Viết bình luận hoặc đặt câu hỏi..." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddComment();
            }}
            style={{
              width: '100%', 
              padding: '1rem 3.5rem 1rem 1.5rem', 
              borderRadius: '2rem', 
              border: '1px solid var(--border)', 
              outline: 'none', 
              fontSize: '0.95rem',
              backgroundColor: '#F9FAFB',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <button 
            style={{
              position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', 
              background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer',
              width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(217, 70, 37, 0.3)'
            }}
            onClick={handleAddComment}
          >
            <Send size={16} style={{marginLeft: '-2px', marginTop: '1px'}} />
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        {comments.map((comment) => (
          <div key={comment.id} className="comment-thread">
            {/* Main Comment */}
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#14B8A6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0}}>{comment.avatar}</div>
              <div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem'}}>
                  <span style={{fontWeight: 700}}>{comment.author}</span>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{comment.time}</span>
                </div>
                <p style={{color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.5}}>{comment.content}</p>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button className="text-muted" style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    Thích (12)
                  </button>
                  <button className="text-muted" style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600}} onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                    Phản hồi
                  </button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div style={{marginLeft: '3.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} style={{display: 'flex', gap: '0.75rem'}}>
                    <div style={{width: '32px', height: '32px', borderRadius: '50%', background: reply.isTutor ? 'var(--primary)' : '#14B8A6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '0.8rem'}}>{reply.avatar}</div>
                    <div>
                      <div style={{display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem'}}>
                        <span style={{fontWeight: 700}}>{reply.author}</span>
                        {reply.isTutor && <span style={{fontSize: '0.75rem', background: 'rgba(249,115,22,0.1)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '1rem', fontWeight: 600}}>Tác giả</span>}
                        <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{reply.time}</span>
                      </div>
                      <p style={{color: 'var(--text-main)', lineHeight: 1.5}}>{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div style={{marginLeft: '3.5rem', marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                <CornerDownRight size={18} className="text-muted" />
                <div style={{flex: 1, position: 'relative'}}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Viết phản hồi..." 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddReply(comment.id);
                    }}
                    style={{width: '100%', paddingRight: '3rem', padding: '0.5rem 1rem'}}
                  />
                  <button 
                    className="text-primary" 
                    style={{position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer'}}
                    onClick={() => handleAddReply(comment.id)}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

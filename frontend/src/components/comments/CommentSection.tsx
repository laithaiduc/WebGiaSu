"use client";
import { useState, useEffect } from 'react';
import { Send, CornerDownRight } from 'lucide-react';
import { fetchComments, postComment } from '@/lib/api';

type DisplayComment = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  isTutor?: boolean;
  replies: DisplayComment[];
};

function buildCommentTree(rows: any[]): DisplayComment[] {
  const map = new Map<number, DisplayComment>();
  const roots: DisplayComment[] = [];

  rows.forEach((row) => {
    map.set(row.id, {
      id: row.id,
      author: row.author_name,
      avatar: (row.author_name || '?').charAt(0).toUpperCase(),
      content: row.content || '',
      time: row.created_at ? new Date(row.created_at).toLocaleString('vi-VN') : '',
      isTutor: Boolean(row.is_tutor),
      replies: [],
    });
  });

  rows.forEach((row) => {
    const node = map.get(row.id)!;
    if (row.parent_id && map.has(row.parent_id)) {
      map.get(row.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function CommentSection({ entityType = 'students', entityId = 0 }: { entityType?: string; entityId?: number; }) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [comments, setComments] = useState<DisplayComment[]>([]);

  const reload = async () => {
    if (!entityId) return;
    const res = await fetchComments(entityType, entityId);
    setComments(buildCommentTree(res.data || []));
  };

  useEffect(() => {
    reload().catch(() => {});
  }, [entityType, entityId]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !entityId) return;
    try {
      await postComment({ entity_type: entityType, entity_id: entityId, content: commentText });
      setCommentText('');
      await reload();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gửi bình luận');
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (!replyText.trim() || !entityId) return;
    try {
      await postComment({ entity_type: entityType, entity_id: entityId, parent_id: commentId, content: replyText });
      setReplyText('');
      setReplyingTo(null);
      await reload();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gửi phản hồi');
    }
  };

  const totalCount = comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0);

  return (
    <div className="comment-section">
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Hỏi đáp & Bình luận ({totalCount})</h3>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Viết bình luận hoặc đặt câu hỏi..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
            style={{ width: '100%', padding: '1rem 3.5rem 1rem 1.5rem', borderRadius: '2rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.95rem', backgroundColor: '#F9FAFB' }}
          />
          <button
            style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleAddComment}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {comments.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center' }}>Chưa có bình luận nào.</p>
        ) : comments.map((comment) => (
          <div key={comment.id} className="comment-thread">
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#14B8A6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{comment.avatar}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700 }}>{comment.author}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comment.time}</span>
                </div>
                <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.5 }}>{comment.content}</p>
                <button className="text-muted" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }} onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                  Phản hồi
                </button>
              </div>
            </div>

            {comment.replies.length > 0 && (
              <div style={{ marginLeft: '3.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: reply.isTutor ? 'var(--primary)' : '#14B8A6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '0.8rem' }}>{reply.avatar}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700 }}>{reply.author}</span>
                        {reply.isTutor && <span style={{ fontSize: '0.75rem', background: 'rgba(249,115,22,0.1)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '1rem', fontWeight: 600 }}>Gia sư</span>}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{reply.time}</span>
                      </div>
                      <p style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {replyingTo === comment.id && (
              <div style={{ marginLeft: '3.5rem', marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <CornerDownRight size={18} className="text-muted" />
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Viết phản hồi..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddReply(comment.id); }}
                    style={{ width: '100%', paddingRight: '3rem', padding: '0.5rem 1rem' }}
                  />
                  <button className="text-primary" style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleAddReply(comment.id)}>
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

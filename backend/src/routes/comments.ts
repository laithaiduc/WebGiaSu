import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../services/comments';
import { authenticateRequest } from '../utils/auth';

const router = Router();

router.get('/', async (req, res) => {
  const entity_type = String(req.query.entity_type || req.query.type || 'posts');
  const entity_id = Number(req.query.entity_id || req.query.id || 0);
  if (!entity_id) return res.status(400).json({ error: 'Missing entity id' });
  const comments = await getComments(entity_type, entity_id);
  return res.json({ data: comments });
});

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { entity_type, entity_id, parent_id, content } = req.body;
  if (!entity_type || !entity_id || !content) return res.status(400).json({ error: 'Thiếu dữ liệu comment.' });

  const result = await createComment({ entity_type, entity_id: Number(entity_id), parent_id: parent_id ? Number(parent_id) : null, author_id: authUser.id, author_name: authUser.name, is_tutor: authUser.role === 'tutor', content });
  const [row] = await (await import('../db')).query('SELECT * FROM comments WHERE id = ?', [result.insertId]) as any;
  return res.json({ data: row[0] || null });
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const [rows] = await (await import('../db')).query('SELECT * FROM comments WHERE id = ?', [id]) as any;
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy comment.' });
  const comment = rows[0];
  if (comment.author_id !== authUser.id && authUser.role !== 'admin') return res.status(403).json({ error: 'Không có quyền xóa.' });

  await deleteComment(id);
  return res.json({ ok: true });
});

export default router;

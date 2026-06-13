import { Router } from 'express';
import { getReviewsByTutor, createReview, deleteReview } from '../services/reviews';
import { authenticateRequest } from '../utils/auth';
import { query } from '../db';

const router = Router();

router.get('/tutor/:id', async (req, res) => {
  const id = Number(req.params.id);
  const reviews = await getReviewsByTutor(id);
  return res.json({ data: reviews });
});

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  // Chỉ học sinh mới được đánh giá gia sư
  if (authUser.role !== 'student' && authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Chỉ học sinh mới có thể đánh giá gia sư.' });
  }

  const { tutor_id, stars, content } = req.body;
  if (!tutor_id || !stars) return res.status(400).json({ error: 'Thiếu dữ liệu đánh giá.' });

  const tutorIdNum = Number(tutor_id);

  // Chặn tự đánh giá chính mình
  if (tutorIdNum === authUser.id) {
    return res.status(400).json({ error: 'Bạn không thể tự đánh giá chính mình.' });
  }

  // Chặn đánh giá trùng (1 học sinh chỉ review 1 lần cho mỗi gia sư)
  const existing = await query<any[]>(
    'SELECT id FROM reviews WHERE tutor_id = ? AND author_id = ?',
    [tutorIdNum, authUser.id]
  );
  if (existing.length > 0) {
    return res.status(400).json({ error: 'Bạn đã đánh giá gia sư này rồi.' });
  }

  const result = await createReview({ tutor_id: tutorIdNum, author_id: authUser.id, author_name: authUser.name, stars: Number(stars), content });
  const rows = await query<any[]>('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
  return res.json({ data: rows[0] || null });
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const rows = await query<any[]>('SELECT * FROM reviews WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy đánh giá.' });
  const review = rows[0];
  if (review.author_id !== authUser.id && authUser.role !== 'admin') return res.status(403).json({ error: 'Không có quyền xóa.' });

  await deleteReview(id);
  return res.json({ ok: true });
});

export default router;

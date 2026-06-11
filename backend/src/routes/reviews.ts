import { Router } from 'express';
import { getReviewsByTutor, createReview, deleteReview } from '../services/reviews';
import { authenticateRequest } from '../utils/auth';

const router = Router();

router.get('/tutor/:id', async (req, res) => {
  const id = Number(req.params.id);
  const reviews = await getReviewsByTutor(id);
  return res.json({ data: reviews });
});

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { tutor_id, stars, content } = req.body;
  if (!tutor_id || !stars) return res.status(400).json({ error: 'Thiếu dữ liệu đánh giá.' });

  const result = await createReview({ tutor_id: Number(tutor_id), author_id: authUser.id, author_name: authUser.name, stars: Number(stars), content });
  const [row] = await (await import('../db')).query('SELECT * FROM reviews WHERE id = ?', [result.insertId]) as any;
  return res.json({ data: row[0] || null });
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const [rows] = await (await import('../db')).query('SELECT * FROM reviews WHERE id = ?', [id]) as any;
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy đánh giá.' });
  const review = rows[0];
  if (review.author_id !== authUser.id && authUser.role !== 'admin') return res.status(403).json({ error: 'Không có quyền xóa.' });

  await deleteReview(id);
  return res.json({ ok: true });
});

export default router;

import { Router } from 'express';
import { createApplication, getApplicationsByPost, getApplicationsByStudent, getApplicationsForPostAuthor, updateApplicationStatus, deleteApplication } from '../services/applications';
import { authenticateRequest } from '../utils/auth';
import { query } from '../db';

const router = Router();

router.get('/post/:id', async (req, res) => {
  const id = Number(req.params.id);
  const apps = await getApplicationsByPost(id);
  return res.json({ data: apps });
});

router.get('/me', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  const apps = await getApplicationsByStudent(authUser.id);
  return res.json({ data: apps });
});

router.get('/received', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  const apps = await getApplicationsForPostAuthor(authUser.id);
  return res.json({ data: apps });
});

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { post_id } = req.body;
  if (!post_id) return res.status(400).json({ error: 'Thiếu post_id' });

  // prevent duplicate applications
  const [existing] = await query('SELECT * FROM applications WHERE post_id = ? AND student_id = ?', [post_id, authUser.id]) as any;
  if (existing.length) return res.status(400).json({ error: 'Bạn đã ứng tuyển bài đăng này.' });

  const result = await createApplication({ post_id: Number(post_id), student_id: authUser.id, student_name: authUser.name });
  const [row] = await (await import('../db')).query('SELECT * FROM applications WHERE id = ?', [result.insertId]) as any;
  return res.json({ data: row[0] || null });
});

router.put('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const { status } = req.body;
  if (!['pending','accepted','rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const [rows] = await query('SELECT * FROM applications WHERE id = ?', [id]) as any;
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy ứng tuyển.' });
  const app = rows[0];

  // check if authUser is the post author or admin
  const [postRows] = await query('SELECT * FROM posts WHERE id = ?', [app.post_id]) as any;
  const post = postRows[0];
  if (!post) return res.status(404).json({ error: 'Bài đăng không tồn tại.' });
  if (post.author_id !== authUser.id && authUser.role !== 'admin') return res.status(403).json({ error: 'Không có quyền thay đổi trạng thái.' });

  await updateApplicationStatus(id, status);
  return res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const [rows] = await query('SELECT * FROM applications WHERE id = ?', [id]) as any;
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy ứng tuyển.' });
  const app = rows[0];
  if (app.student_id !== authUser.id && authUser.role !== 'admin') return res.status(403).json({ error: 'Không có quyền xóa.' });

  await deleteApplication(id);
  return res.json({ ok: true });
});

export default router;

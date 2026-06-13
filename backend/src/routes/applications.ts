import { Router } from 'express';
import { createApplication, getApplicationsByPost, getApplicationsByStudent, getApplicationsForPostAuthor, updateApplicationStatus, deleteApplication } from '../services/applications';
import { authenticateRequest } from '../utils/auth';
import { query } from '../db';

const router = Router();

router.get('/post/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);

  // Chỉ tác giả bài đăng hoặc admin được xem danh sách ứng tuyển
  const postRows = await query<any[]>('SELECT * FROM posts WHERE id = ?', [id]);
  const post = postRows[0];
  if (!post) return res.status(404).json({ error: 'Bài đăng không tồn tại.' });
  if (post.author_id !== authUser.id && authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Bạn không có quyền xem danh sách này.' });
  }

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

  // Lấy bài đăng để kiểm tra (không destructure — query trả về mảng rows)
  const postRows = await query<any[]>('SELECT * FROM posts WHERE id = ?', [post_id]);
  const post = postRows[0];
  if (!post) return res.status(404).json({ error: 'Bài đăng không tồn tại.' });

  // Chặn tự ứng tuyển vào bài của mình
  if (post.author_id === authUser.id) {
    return res.status(400).json({ error: 'Bạn không thể ứng tuyển vào bài đăng của chính mình.' });
  }

  // Validate role phù hợp với loại bài:
  // Bài type='student' (học sinh tìm gia sư) → chỉ gia sư được ứng tuyển
  // Bài type='tutor'   (gia sư tìm học sinh) → chỉ học sinh được ứng tuyển
  if (authUser.role === 'student' && post.type !== 'tutor') {
    return res.status(403).json({ error: 'Học sinh chỉ có thể ứng tuyển vào bài đăng của gia sư.' });
  }
  if (authUser.role === 'tutor' && post.type !== 'student') {
    return res.status(403).json({ error: 'Gia sư chỉ có thể ứng tuyển vào bài đăng tìm gia sư.' });
  }

  // Chặn ứng tuyển trùng
  const existing = await query<any[]>(
    'SELECT id FROM applications WHERE post_id = ? AND student_id = ?',
    [post_id, authUser.id]
  );
  if (existing.length) return res.status(400).json({ error: 'Bạn đã ứng tuyển bài đăng này.' });

  const result = await createApplication({ post_id: Number(post_id), student_id: authUser.id, student_name: authUser.name });
  const newApp = await query<any[]>('SELECT * FROM applications WHERE id = ?', [result.insertId]);
  return res.json({ data: newApp[0] || null });
});

router.put('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const { status } = req.body;
  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ.' });
  }

  const appRows = await query<any[]>('SELECT * FROM applications WHERE id = ?', [id]);
  if (!appRows.length) return res.status(404).json({ error: 'Không tìm thấy ứng tuyển.' });
  const app = appRows[0];

  // Chỉ tác giả bài đăng hoặc admin mới được cập nhật trạng thái
  const postRows = await query<any[]>('SELECT * FROM posts WHERE id = ?', [app.post_id]);
  const post = postRows[0];
  if (!post) return res.status(404).json({ error: 'Bài đăng không tồn tại.' });
  if (post.author_id !== authUser.id && authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Không có quyền thay đổi trạng thái.' });
  }

  await updateApplicationStatus(id, status);
  return res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const appRows = await query<any[]>('SELECT * FROM applications WHERE id = ?', [id]);
  if (!appRows.length) return res.status(404).json({ error: 'Không tìm thấy ứng tuyển.' });
  const app = appRows[0];

  if (app.student_id !== authUser.id && authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Không có quyền xóa.' });
  }

  await deleteApplication(id);
  return res.json({ ok: true });
});

export default router;

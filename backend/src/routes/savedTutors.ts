import { Router } from 'express';
import { saveTutor, unsaveTutor, getSavedForStudent } from '../services/savedTutors';
import { authenticateRequest } from '../utils/auth';
import { query } from '../db';

const router = Router();

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { student_id, tutor_id } = req.body;
  const studentId = Number(student_id ?? authUser.id);
  const tutorId = Number(tutor_id);
  if (!tutorId) return res.status(400).json({ error: 'Missing tutor_id' });
  if (authUser.role !== 'student' && authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Chỉ học sinh mới lưu được gia sư.' });
  }
  if (authUser.role === 'student' && studentId !== authUser.id) {
    return res.status(403).json({ error: 'Không có quyền.' });
  }

  const tutorRow = await query<any[]>('SELECT id FROM users WHERE id = ? AND role = ?', [tutorId, 'tutor']);
  if (!tutorRow.length) return res.status(404).json({ error: 'Tutor not found' });

  await saveTutor(studentId, tutorId);
  return res.json({ data: 'saved' });
});

router.delete('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { student_id, tutor_id } = req.body;
  const studentId = Number(student_id ?? authUser.id);
  const tutorId = Number(tutor_id);
  if (!tutorId) return res.status(400).json({ error: 'Missing tutor_id' });
  if (authUser.role === 'student' && studentId !== authUser.id) {
    return res.status(403).json({ error: 'Không có quyền.' });
  }

  await unsaveTutor(studentId, tutorId);
  return res.json({ data: 'unsaved' });
});

router.get('/student/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  if (authUser.role !== 'admin' && authUser.id !== id) {
    return res.status(403).json({ error: 'Không có quyền.' });
  }

  const list = await getSavedForStudent(id);
  return res.json({ data: list });
});

export default router;

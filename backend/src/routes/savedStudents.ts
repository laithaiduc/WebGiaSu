import { Router } from 'express';
import { saveStudent, unsaveStudent, getSavedForTutor } from '../services/savedStudents';
import { authenticateRequest } from '../utils/auth';
import { query } from '../db';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const authUser = await authenticateRequest(req, res);
    if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

    const { tutor_id, student_id } = req.body;
    const tutorId = Number(tutor_id ?? authUser.id);
    const studentId = Number(student_id);
    if (!studentId) return res.status(400).json({ error: 'Missing parameters' });
    if (!Number.isFinite(tutorId) || !Number.isFinite(studentId)) return res.status(400).json({ error: 'Invalid id' });
    if (authUser.role === 'tutor' && tutorId !== authUser.id) {
      return res.status(403).json({ error: 'Không có quyền.' });
    }

    // validate users exist
    const tutorRow = await query<any[]>('SELECT id FROM users WHERE id = ?', [tutorId]);
    const studentRow = await query<any[]>('SELECT id FROM users WHERE id = ?', [studentId]);
    if (tutorRow.length === 0) return res.status(404).json({ error: 'Tutor not found' });
    if (studentRow.length === 0) return res.status(404).json({ error: 'Student not found' });

    await saveStudent(tutorId, studentId);
    res.json({ data: 'saved' });
  } catch (err: any) {
    console.error('Failed to save student', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const authUser = await authenticateRequest(req, res);
    if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

    const { tutor_id, student_id } = req.body;
    const tutorId = Number(tutor_id ?? authUser.id);
    const studentId = Number(student_id);
    if (!studentId) return res.status(400).json({ error: 'Missing parameters' });
    if (authUser.role === 'tutor' && tutorId !== authUser.id) {
      return res.status(403).json({ error: 'Không có quyền.' });
    }
    if (!Number.isFinite(tutorId) || !Number.isFinite(studentId)) return res.status(400).json({ error: 'Invalid id' });

    await unsaveStudent(tutorId, studentId);
    res.json({ data: 'unsaved' });
  } catch (err: any) {
    console.error('Failed to unsave student', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
});

router.get('/tutor/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  if (authUser.role !== 'admin' && authUser.id !== id) {
    return res.status(403).json({ error: 'Không có quyền.' });
  }

  const list = await getSavedForTutor(id);
  return res.json({ data: list });
});

export default router;

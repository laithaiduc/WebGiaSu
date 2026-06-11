import { Router } from 'express';
import { createReport, getReports, updateReportStatus, deleteReport } from '../services/reports';
import { authenticateRequest } from '../utils/auth';
import { query } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  if (authUser.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin mới xem được báo cáo.' });

  const status = req.query.status ? String(req.query.status) as 'pending' | 'resolved' | 'dismissed' : undefined;
  const reports = await getReports(status);
  return res.json({ data: reports });
});

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { target_type, target_id, reason, content } = req.body;
  if (!target_type || !target_id) return res.status(400).json({ error: 'Thiếu thông tin báo cáo.' });

  const result = await createReport({
    reporter_id: authUser.id,
    target_type,
    target_id: Number(target_id),
    reason,
    content,
  });
  const [row] = await query<any[]>('SELECT * FROM reports WHERE id = ?', [(result as any).insertId]);
  return res.json({ data: row });
});

router.put('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  if (authUser.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin mới xử lý được báo cáo.' });

  const id = Number(req.params.id);
  const { status } = req.body;
  if (!['pending', 'resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ.' });
  }

  await updateReportStatus(id, status);
  return res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  if (authUser.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin mới xóa được báo cáo.' });

  await deleteReport(Number(req.params.id));
  return res.json({ ok: true });
});

export default router;

import { Router } from 'express';
import { query } from '../db';
import { authenticateRequest } from '../utils/auth';
import { upsertTutorProfile } from '../services/tutors';

const router = Router();

const sanitizeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || '',
  gender: user.gender || '',
  avatar: user.avatar || '',
  created_at: user.created_at,
});

router.get('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  if (authUser.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin mới xem được danh sách người dùng.' });

  const users = await query<any[]>(
    'SELECT id, name, email, role, phone, gender, avatar, created_at FROM users ORDER BY id DESC LIMIT 200'
  );
  return res.json({ data: users.map(sanitizeUser) });
});

router.get('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const rows = await query<any[]>(
    'SELECT id, name, email, role, phone, gender, avatar, created_at FROM users WHERE id = ?',
    [id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

  const user = rows[0];
  // Ẩn email với người dùng khác (chỉ admin hoặc chính mình mới thấy email)
  if (authUser.role !== 'admin' && authUser.id !== id) {
    const { email: _email, ...publicUser } = sanitizeUser(user);
    return res.json({ data: publicUser });
  }
  return res.json({ data: sanitizeUser(user) });
});

router.put('/:id/role', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  if (authUser.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin mới đổi được vai trò.' });

  const id = Number(req.params.id);
  const { role } = req.body;
  if (!['student', 'tutor', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Vai trò không hợp lệ.' });
  }

  await query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  if (role === 'tutor') {
    await upsertTutorProfile(id, {});
  }
  const [updated] = await query<any[]>('SELECT id, name, email, role, phone, gender, avatar, created_at FROM users WHERE id = ?', [id]);
  return res.json({ data: sanitizeUser(updated) });
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  if (authUser.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin mới xóa được người dùng.' });

  const id = Number(req.params.id);
  if (id === authUser.id) return res.status(400).json({ error: 'Không thể xóa chính mình.' });

  await query('DELETE FROM users WHERE id = ?', [id]);
  return res.json({ ok: true });
});

export default router;

import { Router } from 'express';
import { query } from '../db';
import { authenticateRequest } from '../utils/auth';

const router = Router();

router.get('/', async (req, res) => {
  const type = req.query.type === 'tutor' ? 'tutor' : 'student';
  const posts = await query<any[]>('SELECT * FROM posts WHERE type = ? ORDER BY id DESC', [type]);
  return res.json({ data: posts });
});

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const {
    type,
    title,
    subject,
    grade,
    format,
    price,
    status,
    time,
    description,
    classType,
    maxStudents,
  } = req.body;

  if (!type || !title) {
    return res.status(400).json({ error: 'Thiếu thông tin bài đăng.' });
  }

  try {
    console.log('Create post payload:', req.body, 'by user', authUser.id);
    console.log('Request cookies header:', req.headers && req.headers.cookie);

    const sql = 'INSERT INTO posts (`author_id`, `author_name`, `author_role`, `type`, `title`, `status`, `subject`, `grade`, `format`, `price`, `time`, `description`, `class_type`, `max_students`, `applicants`, `tutor`, `registered_students`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
      authUser.id,
      authUser.name,
      authUser.role,
      type,
      title,
      status || 'Chờ duyệt',
      subject || '',
      grade || '',
      format || '',
      price || '',
      time || '',
      description || '',
      classType || '',
      maxStudents || 1,
      0,
      null,
      0,
    ];

    console.log('Running SQL:', sql, 'params:', params);
    const result = await query<any>(sql, params);
    console.log('Insert result:', result);

    let insertId: number | undefined;
    if (result && typeof (result as any).insertId === 'number') {
      insertId = (result as any).insertId;
    }

    if (!insertId) {
      console.log('insertId missing on result, querying LAST_INSERT_ID()');
      const [[row]] = await query<any[]>('SELECT LAST_INSERT_ID() as id') as any;
      console.log('LAST_INSERT_ID() row:', row);
      insertId = row && row.id ? Number(row.id) : undefined;
    }

    if (!insertId) {
      console.error('Insert did not return an insertId', result);
      return res.status(500).json({ error: 'Không thể lấy ID bài đăng vừa tạo.' });
    }

    const [postRows] = await query<any[]>('SELECT * FROM posts WHERE id = ?', [insertId]);
    console.log('Created post row:', postRows && postRows[0]);
    return res.json({ data: postRows[0] });
  } catch (err: any) {
    console.error('Error creating post:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Lỗi khi tạo bài đăng.' });
  }
});

router.put('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const existing = await query<any[]>('SELECT * FROM posts WHERE id = ?', [id]);
  if (!existing.length) return res.status(404).json({ error: 'Bài đăng không tồn tại.' });

  const post = existing[0];
  if (post.author_id !== authUser.id && authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa.' });
  }

  const {
    title,
    subject,
    grade,
    format,
    price,
    status,
    time,
    description,
    classType,
    maxStudents,
  } = req.body;

  try {
    const sql = `UPDATE posts SET title = ?, subject = ?, grade = ?, format = ?, price = ?, status = ?, time = ?, description = ?, class_type = ?, max_students = ? WHERE id = ?`;
    const params = [
      title ?? post.title,
      subject ?? post.subject,
      grade ?? post.grade,
      format ?? post.format,
      price ?? post.price,
      status ?? post.status,
      time ?? post.time,
      description ?? post.description,
      classType ?? post.class_type,
      maxStudents ?? post.max_students,
      id,
    ];

    console.log('Updating post id', id, 'with', params);
    const result = await query<any>(sql, params);
    console.log('Update result:', result);

    const [updatedRows] = await query<any[]>('SELECT * FROM posts WHERE id = ?', [id]);
    return res.json({ data: updatedRows[0] });
  } catch (err: any) {
    console.error('Error updating post:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Lỗi khi cập nhật bài đăng.' });
  }
});

router.delete('/:id', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const id = Number(req.params.id);
  const [rows] = await query<any[]>('SELECT * FROM posts WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Bài đăng không tồn tại.' });

  const post = rows[0];
  if (post.author_id !== authUser.id && authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Bạn không có quyền xóa.' });
  }

  await query('DELETE FROM posts WHERE id = ?', [id]);
  return res.json({ ok: true });
});

export default router;

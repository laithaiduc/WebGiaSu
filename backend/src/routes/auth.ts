import { Router } from 'express';
import { query } from '../db';
import {
  authenticateRequest,
  clearAuthCookies,
  getRefreshTokenFromRequest,
  hashPassword,
  sendAccessToken,
  sendRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  TokenPayload,
  findUserByRefreshToken,
  clearRefreshToken,
} from '../utils/auth';
import bcrypt from 'bcrypt';
import { upsertTutorProfile } from '../services/tutors';

const router = Router();

const sanitizeUser = (user: any) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    gender: user.gender || '',
    avatar: user.avatar || '',
  };
};

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
  }

  const existing = await query<any[]>('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ error: 'Email đã tồn tại.' });
  }

  const passwordHash = await hashPassword(password);
  const result = await query<any>('INSERT INTO users (`name`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)', [
    name,
    email,
    passwordHash,
    role,
  ]);

  if (role === 'tutor') {
    await upsertTutorProfile(result.insertId, {});
  }

  const userPayload: TokenPayload = {
    id: result.insertId,
    name,
    email,
    role,
  };

  const accessToken = signAccessToken(userPayload);
  const refreshToken = signRefreshToken(userPayload);
  await query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userPayload.id]);

  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);

  return res.json({ 
    user: sanitizeUser({ ...userPayload, phone: '', gender: '', avatar: '' }),
    accessToken,
    refreshToken
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu.' });
  }

  const users = await query<any[]>('SELECT id, name, email, role, phone, gender, avatar, password FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  }

  const user = users[0];
  const storedPassword = user.password;
  if (!storedPassword) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  }
  const isValid = await bcrypt.compare(password, storedPassword);

  if (!isValid) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  }

  const tokenPayload: TokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);
  await query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);

  return res.json({ 
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  });
});

router.post('/logout', async (req, res) => {
  const refreshToken = getRefreshTokenFromRequest(req);
  if (refreshToken) {
    const user = await findUserByRefreshToken(refreshToken);
    if (user) {
      await clearRefreshToken(user.id);
    }
  }

  clearAuthCookies(res);
  return res.json({ ok: true });
});

router.post('/refresh', async (req, res) => {
  const refreshToken = getRefreshTokenFromRequest(req);
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token không tồn tại.' });
  }

  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({ error: 'Refresh token không hợp lệ.' });
  }

  const user = await findUserByRefreshToken(refreshToken);
  if (!user || user.id !== payload.id) {
    return res.status(401).json({ error: 'Refresh token không hợp lệ.' });
  }

  const tokenPayload: TokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);
  await query('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, user.id]);

  sendAccessToken(res, newAccessToken);
  sendRefreshToken(res, newRefreshToken);

  return res.json({ 
    user: sanitizeUser(user),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
});

router.get('/me', async (req, res) => {
  const user = await authenticateRequest(req, res);
  if (!user) return res.status(200).json({ user: null });
  const row = await query<any[]>('SELECT id, name, email, role, phone, gender, avatar FROM users WHERE id = ?', [user.id]);
  return res.json({ user: sanitizeUser(row[0]) });
});

router.put('/profile', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { name, phone, gender, avatar } = req.body;
  await query('UPDATE users SET name = ?, phone = ?, gender = ?, avatar = ? WHERE id = ?', [
    name || authUser.name,
    phone || null,
    gender || null,
    avatar || null,
    authUser.id,
  ]);

  const [updatedUser] = await query<any[]>('SELECT id, name, email, role, phone, gender, avatar FROM users WHERE id = ?', [authUser.id]);
  return res.json({ user: sanitizeUser(updatedUser) });
});

export default router;

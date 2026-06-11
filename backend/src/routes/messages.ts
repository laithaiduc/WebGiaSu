import { Router } from 'express';
import { sendMessage, fetchConversation, fetchInbox, fetchThreads, markConversationRead, getUnreadCount } from '../services/messages';
import { authenticateRequest } from '../utils/auth';
import { query } from '../db';
import { emitNewMessage, emitUnreadCount } from '../realtime';

const router = Router();

async function pushUnreadCount(userId: number) {
  const count = await getUnreadCount(userId);
  emitUnreadCount(userId, count);
}

router.post('/', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const { receiver_id, content } = req.body;
  if (!receiver_id || !content) return res.status(400).json({ error: 'Missing parameters' });

  const receiverId = Number(receiver_id);
  const [receiver] = await query<any[]>('SELECT id FROM users WHERE id = ?', [receiverId]);
  if (!receiver) return res.status(404).json({ error: 'Người nhận không tồn tại.' });

  const message = await sendMessage(authUser.id, receiverId, String(content));
  if (message) {
    emitNewMessage(message);
    await pushUnreadCount(receiverId);
    await pushUnreadCount(authUser.id);
  }

  return res.json({ data: message });
});

router.get('/conversation', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const otherId = Number(req.query.other || req.query.b);
  if (!otherId) return res.status(400).json({ error: 'Missing other user id' });

  const conv = await fetchConversation(authUser.id, otherId);
  return res.json({ data: conv });
});

router.get('/inbox', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const inbox = await fetchInbox(authUser.id);
  return res.json({ data: inbox });
});

router.get('/threads', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const threads = await fetchThreads(authUser.id);
  return res.json({ data: threads });
});

router.get('/unread-count', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const count = await getUnreadCount(authUser.id);
  return res.json({ count });
});

router.put('/read', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });

  const otherId = Number(req.body.other_id || req.query.other);
  if (!otherId) return res.status(400).json({ error: 'Missing other user id' });

  await markConversationRead(authUser.id, otherId);
  await pushUnreadCount(authUser.id);
  return res.json({ ok: true });
});

export default router;

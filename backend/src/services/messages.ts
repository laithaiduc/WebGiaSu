import { query } from '../db';

export async function sendMessage(senderId: number, receiverId: number, content: string) {
  const result = await query<any>(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [senderId, receiverId, content]
  );
  const insertId = result?.insertId;
  if (!insertId) return null;
  const rows = await query<any[]>('SELECT * FROM messages WHERE id = ?', [insertId]);
  return rows[0] || null;
}

export async function getUnreadCount(userId: number) {
  const rows = await query<any[]>(
    'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0',
    [userId]
  );
  return Number(rows[0]?.count || 0);
}

export async function fetchConversation(userA: number, userB: number) {
  return query('SELECT id, sender_id, receiver_id, content, is_read, created_at FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC', [userA, userB, userB, userA]);
}

export async function fetchInbox(userId: number) {
  return query('SELECT m.id, m.sender_id, m.receiver_id, m.content, m.is_read, m.created_at, u.name as sender_name FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.receiver_id = ? ORDER BY m.created_at DESC', [userId]);
}

export async function fetchThreads(userId: number) {
  const rows = await query<any[]>(
    `SELECT m.id, m.sender_id, m.receiver_id, m.content, m.is_read, m.created_at,
            sender.name AS sender_name, receiver.name AS receiver_name,
            sender.avatar AS sender_avatar, receiver.avatar AS receiver_avatar,
            sender.role AS sender_role, receiver.role AS receiver_role
     FROM messages m
     JOIN users sender ON sender.id = m.sender_id
     JOIN users receiver ON receiver.id = m.receiver_id
     WHERE m.sender_id = ? OR m.receiver_id = ?
     ORDER BY m.created_at DESC`,
    [userId, userId]
  );

  const threads = new Map<number, any>();
  for (const row of rows) {
    const partnerId = row.sender_id === userId ? row.receiver_id : row.sender_id;
    if (threads.has(partnerId)) continue;

    const partnerIsSender = row.sender_id === partnerId;
    threads.set(partnerId, {
      partner_id: partnerId,
      partner_name: partnerIsSender ? row.sender_name : row.receiver_name,
      partner_avatar: partnerIsSender ? row.sender_avatar : row.receiver_avatar,
      partner_role: partnerIsSender ? row.sender_role : row.receiver_role,
      last_message: row.content,
      last_at: row.created_at,
      unread: row.receiver_id === userId && !row.is_read,
      is_outgoing: row.sender_id === userId,
    });
  }

  return Array.from(threads.values());
}

export async function markConversationRead(userId: number, otherId: number) {
  return query(
    'UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ? AND is_read = 0',
    [userId, otherId]
  );
}

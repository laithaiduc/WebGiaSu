import { query } from '../db';

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export async function getReports(status?: ReportStatus) {
  if (status) {
    return query(
      `SELECT r.*, u.name as reporter_name FROM reports r LEFT JOIN users u ON u.id = r.reporter_id WHERE r.status = ? ORDER BY r.id DESC`,
      [status]
    );
  }
  return query(`SELECT r.*, u.name as reporter_name FROM reports r LEFT JOIN users u ON u.id = r.reporter_id ORDER BY r.id DESC`);
}

export async function createReport(data: {
  reporter_id?: number | null;
  target_type: 'user' | 'comment' | 'post';
  target_id: number;
  reason?: string;
  content?: string;
}) {
  return query(
    'INSERT INTO reports (reporter_id, target_type, target_id, reason, content) VALUES (?, ?, ?, ?, ?)',
    [data.reporter_id ?? null, data.target_type, data.target_id, data.reason || '', data.content || '']
  );
}

export async function updateReportStatus(id: number, status: ReportStatus) {
  return query('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
}

export async function deleteReport(id: number) {
  return query('DELETE FROM reports WHERE id = ?', [id]);
}

import { query } from '../db';
import type { Application } from '../types';

export async function getApplicationsByPost(postId: number): Promise<Application[]> {
  return query<Application[]>('SELECT * FROM applications WHERE post_id = ? ORDER BY id DESC', [postId]);
}

export async function getApplicationsByStudent(studentId: number): Promise<Application[]> {
  return query<Application[]>('SELECT * FROM applications WHERE student_id = ? ORDER BY id DESC', [studentId]);
}

export async function getApplicationsForPostAuthor(authorId: number) {
  return query(
    `SELECT a.*, p.title as post_title, p.subject as post_subject, p.type as post_type
     FROM applications a
     JOIN posts p ON p.id = a.post_id
     WHERE p.author_id = ?
     ORDER BY a.id DESC`,
    [authorId]
  );
}

export async function createApplication(data: { post_id: number; student_id: number; student_name: string; }) {
  return query('INSERT INTO applications (post_id, student_id, student_name) VALUES (?, ?, ?)', [
    data.post_id,
    data.student_id,
    data.student_name,
  ]);
}

export async function updateApplicationStatus(id: number, status: 'pending' | 'accepted' | 'rejected') {
  return query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
}

export async function deleteApplication(id: number) {
  return query('DELETE FROM applications WHERE id = ?', [id]);
}

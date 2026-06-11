import { query } from '../db';

export async function saveStudent(tutorId: number, studentId: number) {
  return query('INSERT INTO saved_students (tutor_id, student_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()', [tutorId, studentId]);
}

export async function unsaveStudent(tutorId: number, studentId: number) {
  return query('DELETE FROM saved_students WHERE tutor_id = ? AND student_id = ?', [tutorId, studentId]);
}

export async function getSavedForTutor(tutorId: number) {
  return query('SELECT s.student_id as id, u.name, u.email, u.phone, u.avatar, s.created_at FROM saved_students s JOIN users u ON u.id = s.student_id WHERE s.tutor_id = ? ORDER BY s.created_at DESC', [tutorId]);
}

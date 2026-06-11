import { query } from '../db';

export async function saveTutor(studentId: number, tutorId: number) {
  return query(
    'INSERT INTO saved_tutors (student_id, tutor_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()',
    [studentId, tutorId]
  );
}

export async function unsaveTutor(studentId: number, tutorId: number) {
  return query('DELETE FROM saved_tutors WHERE student_id = ? AND tutor_id = ?', [studentId, tutorId]);
}

export async function getSavedForStudent(studentId: number) {
  return query(
    `SELECT s.tutor_id as id, u.name, u.email, u.phone, u.gender, u.avatar,
            COALESCE(tp.subjects, '') as subjects,
            COALESCE(tp.location, '') as location,
            COALESCE(tp.price_per_hour, 0) as price_per_hour,
            COALESCE(tp.bio, '') as bio,
            ROUND(AVG(r.stars), 1) as rating,
            s.created_at
     FROM saved_tutors s
     JOIN users u ON u.id = s.tutor_id
     LEFT JOIN tutor_profiles tp ON tp.user_id = u.id
     LEFT JOIN reviews r ON r.tutor_id = u.id
     WHERE s.student_id = ?
     GROUP BY s.tutor_id, u.name, u.email, u.phone, u.gender, u.avatar, tp.subjects, tp.location, tp.price_per_hour, tp.bio, s.created_at
     ORDER BY s.created_at DESC`,
    [studentId]
  );
}

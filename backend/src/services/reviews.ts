import { query } from '../db';
import type { Review } from '../types';

export async function getReviewsByTutor(tutorId: number): Promise<Review[]> {
  return query<Review[]>('SELECT * FROM reviews WHERE tutor_id = ? ORDER BY id DESC', [tutorId]);
}

export async function createReview(data: { tutor_id: number; author_id?: number | null; author_name: string; stars: number; content?: string; }) {
  return query('INSERT INTO reviews (tutor_id, author_id, author_name, stars, content) VALUES (?, ?, ?, ?, ?)', [
    data.tutor_id,
    data.author_id ?? null,
    data.author_name,
    data.stars,
    data.content || '',
  ]);
}

export async function deleteReview(id: number) {
  return query('DELETE FROM reviews WHERE id = ?', [id]);
}

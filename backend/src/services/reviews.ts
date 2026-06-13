import { query } from '../db';
import type { Review } from '../types';

export async function getReviewsByTutor(tutorId: number): Promise<any[]> {
  const reviews = await query<any[]>('SELECT * FROM reviews WHERE tutor_id = ? ORDER BY id DESC', [tutorId]);
  if (reviews.length === 0) return [];
  
  const reviewIds = reviews.map(r => r.id);
  const comments = await query<any[]>('SELECT * FROM comments WHERE entity_type = ? AND entity_id IN (?) ORDER BY id ASC', ['review', reviewIds]);
  
  return reviews.map(r => ({
    ...r,
    replies: comments.filter(c => c.entity_id === r.id).map(c => c.content)
  }));
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

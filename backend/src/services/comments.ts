import { query } from '../db';
import type { Comment } from '../types';

export async function getComments(entityType: string, entityId: number): Promise<Comment[]> {
  return query<Comment[]>('SELECT * FROM comments WHERE entity_type = ? AND entity_id = ? ORDER BY id DESC', [entityType, entityId]);
}

export async function createComment(data: { entity_type: string; entity_id: number; parent_id?: number | null; author_id?: number | null; author_name: string; is_tutor?: boolean; content?: string; }) {
  return query('INSERT INTO comments (entity_type, entity_id, parent_id, author_id, author_name, is_tutor, content) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    data.entity_type,
    data.entity_id,
    data.parent_id ?? null,
    data.author_id ?? null,
    data.author_name,
    data.is_tutor ? 1 : 0,
    data.content || '',
  ]);
}

export async function deleteComment(id: number) {
  return query('DELETE FROM comments WHERE id = ?', [id]);
}

import { query } from '../db';

export type TutorListItem = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  avatar: string;
  subjects: string;
  grades: string;
  location: string;
  region: string;
  price_per_hour: number;
  bio: string;
  experience_years: number;
  formats: string;
  is_accepting: boolean;
  rating: number | null;
  review_count: number;
  created_at: string;
};

export type TutorProfileInput = {
  subjects?: string;
  grades?: string;
  location?: string;
  region?: string;
  price_per_hour?: number;
  bio?: string;
  experience_years?: number;
  formats?: string;
  is_accepting?: boolean;
};

const tutorSelect = `
  u.id, u.name, u.email, u.phone, u.gender, u.avatar, u.created_at,
  COALESCE(tp.subjects, '') as subjects,
  COALESCE(tp.grades, '') as grades,
  COALESCE(tp.location, '') as location,
  COALESCE(tp.region, '') as region,
  COALESCE(tp.price_per_hour, 0) as price_per_hour,
  COALESCE(tp.bio, '') as bio,
  COALESCE(tp.experience_years, 0) as experience_years,
  COALESCE(tp.formats, '') as formats,
  COALESCE(tp.is_accepting, 1) as is_accepting,
  ROUND(AVG(r.stars), 1) as rating,
  COUNT(r.id) as review_count
`;

const tutorFrom = `
  FROM users u
  LEFT JOIN tutor_profiles tp ON tp.user_id = u.id
  LEFT JOIN reviews r ON r.tutor_id = u.id
  WHERE u.role = 'tutor'
`;

function mapTutorRow(row: any): TutorListItem {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    gender: row.gender || '',
    avatar: row.avatar || '',
    subjects: row.subjects || '',
    grades: row.grades || '',
    location: row.location || '',
    region: row.region || '',
    price_per_hour: Number(row.price_per_hour) || 0,
    bio: row.bio || '',
    experience_years: Number(row.experience_years) || 0,
    formats: row.formats || '',
    is_accepting: Boolean(row.is_accepting),
    rating: row.rating != null ? Number(row.rating) : null,
    review_count: Number(row.review_count) || 0,
    created_at: row.created_at,
  };
}

export async function getTutors(filters: {
  subject?: string;
  grade?: string;
  location?: string;
  region?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}): Promise<TutorListItem[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.subject) {
    conditions.push('(tp.subjects LIKE ? OR u.name LIKE ?)');
    params.push(`%${filters.subject}%`, `%${filters.subject}%`);
  }
  if (filters.grade) {
    conditions.push('tp.grades LIKE ?');
    params.push(`%${filters.grade}%`);
  }
  if (filters.location) {
    conditions.push('tp.location LIKE ?');
    params.push(`%${filters.location}%`);
  }
  if (filters.region && filters.region !== 'Bất kỳ') {
    conditions.push('tp.region = ?');
    params.push(filters.region);
  }
  if (filters.gender) {
    conditions.push('u.gender = ?');
    params.push(filters.gender);
  }
  if (filters.minPrice != null) {
    conditions.push('tp.price_per_hour >= ?');
    params.push(filters.minPrice);
  }
  if (filters.maxPrice != null) {
    conditions.push('tp.price_per_hour <= ?');
    params.push(filters.maxPrice);
  }

  const whereExtra = conditions.length ? ` AND ${conditions.join(' AND ')}` : '';
  const sql = `SELECT ${tutorSelect} ${tutorFrom}${whereExtra} GROUP BY u.id ORDER BY u.id DESC LIMIT 100`;
  const rows = await query<any[]>(sql, params);
  return rows.map(mapTutorRow);
}

export async function getTutorById(id: number): Promise<TutorListItem | null> {
  const rows = await query<any[]>(
    `SELECT ${tutorSelect} ${tutorFrom} AND u.id = ? GROUP BY u.id LIMIT 1`,
    [id]
  );
  return rows[0] ? mapTutorRow(rows[0]) : null;
}

export async function upsertTutorProfile(userId: number, data: TutorProfileInput) {
  const existing = await query<any[]>('SELECT user_id FROM tutor_profiles WHERE user_id = ?', [userId]);
  if (existing.length === 0) {
    await query(
      `INSERT INTO tutor_profiles (user_id, subjects, grades, location, region, price_per_hour, bio, experience_years, formats, is_accepting)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.subjects ?? '',
        data.grades ?? '',
        data.location ?? '',
        data.region ?? '',
        data.price_per_hour ?? 0,
        data.bio ?? '',
        data.experience_years ?? 0,
        data.formats ?? '',
        data.is_accepting !== false ? 1 : 0,
      ]
    );
    return;
  }

  const [current] = await query<any[]>('SELECT * FROM tutor_profiles WHERE user_id = ?', [userId]);
  await query(
    `UPDATE tutor_profiles SET subjects = ?, grades = ?, location = ?, region = ?, price_per_hour = ?, bio = ?, experience_years = ?, formats = ?, is_accepting = ? WHERE user_id = ?`,
    [
      data.subjects ?? current.subjects,
      data.grades ?? current.grades,
      data.location ?? current.location,
      data.region ?? current.region,
      data.price_per_hour ?? current.price_per_hour,
      data.bio ?? current.bio,
      data.experience_years ?? current.experience_years,
      data.formats ?? current.formats,
      data.is_accepting !== undefined ? (data.is_accepting ? 1 : 0) : current.is_accepting,
      userId,
    ]
  );
}

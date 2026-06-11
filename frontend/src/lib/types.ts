export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  phone?: string;
  gender?: string;
  avatar?: string;
};

export type Post = {
  id: number;
  author_id: number;
  author_name: string;
  author_role: 'student' | 'tutor';
  type: 'student' | 'tutor';
  title: string;
  status: string;
  subject: string;
  grade: string;
  format: string;
  price: string;
  time: string;
  description: string;
  class_type: string;
  max_students: number;
  applicants: number;
  tutor: string | null;
  registered_students: number;
  created_at: string;
};

export type TutorProfile = {
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

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  avatar: string;
  created_at: string;
};

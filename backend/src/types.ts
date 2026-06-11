export type User = {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  password?: string;
  refresh_token?: string | null;
  phone?: string;
  gender?: string;
  avatar?: string;
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

export type Review = {
  id: number;
  tutor_id: number;
  author_id?: number | null;
  author_name: string;
  stars: number;
  content?: string;
  created_at: string;
};

export type Comment = {
  id: number;
  entity_type: string;
  entity_id: number;
  parent_id?: number | null;
  author_id?: number | null;
  author_name: string;
  is_tutor?: boolean;
  content?: string;
  created_at: string;
};

export type Application = {
  id: number;
  post_id: number;
  student_id: number;
  student_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

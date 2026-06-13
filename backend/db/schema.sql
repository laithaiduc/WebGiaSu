CREATE DATABASE IF NOT EXISTS webgiasu;
USE webgiasu;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'tutor', 'admin') NOT NULL DEFAULT 'student',
  phone VARCHAR(50) DEFAULT '',
  gender VARCHAR(20) DEFAULT '',
  avatar VARCHAR(255) DEFAULT '',
  refresh_token TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS posts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  author_id INT UNSIGNED NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_role ENUM('student','tutor') NOT NULL,
  type ENUM('student','tutor') NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'Chờ duyệt',
  subject VARCHAR(100) DEFAULT '',
  grade VARCHAR(100) DEFAULT '',
  format VARCHAR(100) DEFAULT '',
  price VARCHAR(100) DEFAULT '',
  time VARCHAR(100) DEFAULT '',
  description VARCHAR(5000) DEFAULT '',
  class_type VARCHAR(50) DEFAULT '',
  max_students INT DEFAULT 1,
  applicants INT DEFAULT 0,
  tutor VARCHAR(100) DEFAULT NULL,
  registered_students INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tutor_profiles (
  user_id INT UNSIGNED NOT NULL,
  subjects VARCHAR(500) DEFAULT '',
  grades VARCHAR(500) DEFAULT '',
  location VARCHAR(200) DEFAULT '',
  region VARCHAR(50) DEFAULT '',
  price_per_hour INT UNSIGNED DEFAULT 0,
  bio TEXT,
  experience_years INT UNSIGNED DEFAULT 0,
  formats VARCHAR(200) DEFAULT '',
  is_accepting TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tutor_id INT UNSIGNED NOT NULL,
  author_id INT UNSIGNED DEFAULT NULL,
  author_name VARCHAR(150) NOT NULL,
  stars TINYINT NOT NULL DEFAULT 5,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  parent_id INT UNSIGNED DEFAULT NULL,
  author_id INT UNSIGNED DEFAULT NULL,
  author_name VARCHAR(150) NOT NULL,
  is_tutor TINYINT(1) DEFAULT 0,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT IGNORE INTO users (name, email, password, role, phone, gender, avatar) VALUES
('Quản trị viên', 'admin@tutor.com', 'admin123', 'admin', '0900000000', 'Nam', ''),
('Gia sư Trần B', 'tutor@tutor.com', 'tutor123', 'tutor', '0901111222', 'Nữ', ''),
('Học sinh Văn A', 'student@tutor.com', 'student123', 'student', '0902222333', 'Nam', '');

INSERT IGNORE INTO tutor_profiles (user_id, subjects, grades, location, region, price_per_hour, bio, experience_years, formats, is_accepting)
SELECT id, 'Toán học, Vật lý', 'Lớp 10, Lớp 11, Lớp 12', 'Quận 1, TP.HCM', 'Miền Nam', 150000,
  'Sinh viên năm 3 Đại học Bách Khoa, có 2 năm kinh nghiệm gia sư môn Toán, Lý.', 2, 'Online, Offline', 1
FROM users WHERE email = 'tutor@tutor.com' LIMIT 1;

CREATE TABLE IF NOT EXISTS saved_tutors (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_id INT UNSIGNED NOT NULL,
  tutor_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY student_tutor (student_id, tutor_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reporter_id INT UNSIGNED DEFAULT NULL,
  target_type ENUM('user', 'comment', 'post') NOT NULL,
  target_id INT UNSIGNED NOT NULL,
  reason VARCHAR(255) DEFAULT '',
  content TEXT,
  status ENUM('pending', 'resolved', 'dismissed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table for tutors saving student profiles
CREATE TABLE IF NOT EXISTS saved_students (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tutor_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY tutor_student (tutor_id, student_id),
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Simple messages table for basic in-app messaging
CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sender_id INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

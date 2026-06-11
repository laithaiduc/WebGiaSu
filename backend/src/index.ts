import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initRealtime } from './realtime';
import usersRouter from './routes/users';
import tutorsRouter from './routes/tutors';
import authRouter from './routes/auth';
import postsRouter from './routes/posts';
import reviewsRouter from './routes/reviews';
import commentsRouter from './routes/comments';
import applicationsRouter from './routes/applications';
import savedStudentsRouter from './routes/savedStudents';
import savedTutorsRouter from './routes/savedTutors';
import messagesRouter from './routes/messages';
import reportsRouter from './routes/reports';
import { query } from './db';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'backend running' });
});

app.use('/users', usersRouter);
app.use('/tutors', tutorsRouter);
app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/reviews', reviewsRouter);
app.use('/comments', commentsRouter);
app.use('/applications', applicationsRouter);
app.use('/saved-students', savedStudentsRouter);
app.use('/saved-tutors', savedTutorsRouter);
app.use('/messages', messagesRouter);
app.use('/reports', reportsRouter);

async function ensureTables() {
  await query(`CREATE TABLE IF NOT EXISTS tutor_profiles (
    user_id INT UNSIGNED NOT NULL,
    subjects VARCHAR(500) DEFAULT '',
    grades VARCHAR(500) DEFAULT '',
    location VARCHAR(200) DEFAULT '',
    region VARCHAR(50) DEFAULT '',
    price_per_hour INT UNSIGNED DEFAULT 0,
    bio TEXT DEFAULT '',
    experience_years INT UNSIGNED DEFAULT 0,
    formats VARCHAR(200) DEFAULT '',
    is_accepting TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS saved_students (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tutor_id INT UNSIGNED NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY tutor_student (tutor_id, student_id),
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS saved_tutors (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id INT UNSIGNED NOT NULL,
    tutor_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY student_tutor (student_id, tutor_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS messages (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    sender_id INT UNSIGNED NOT NULL,
    receiver_id INT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS reports (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    reporter_id INT UNSIGNED DEFAULT NULL,
    target_type ENUM('user', 'comment', 'post') NOT NULL,
    target_id INT UNSIGNED NOT NULL,
    reason VARCHAR(255) DEFAULT '',
    content TEXT DEFAULT '',
    status ENUM('pending', 'resolved', 'dismissed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
  )`);

  // Seed tutor profile for existing tutor account if missing
  await query(`
    INSERT IGNORE INTO tutor_profiles (user_id, subjects, grades, location, region, price_per_hour, bio, experience_years, formats, is_accepting)
    SELECT id, 'Toán học, Vật lý', 'Lớp 10, Lớp 11, Lớp 12', 'Quận 1, TP.HCM', 'Miền Nam', 150000,
      'Sinh viên năm 3 Đại học Bách Khoa, có 2 năm kinh nghiệm gia sư môn Toán, Lý.', 2, 'Online, Offline', 1
    FROM users WHERE email = 'tutor@tutor.com' AND role = 'tutor' LIMIT 1
  `);
}

ensureTables().catch(err => console.error('Failed to ensure tables', err));

const server = http.createServer(app);
initRealtime(server);

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

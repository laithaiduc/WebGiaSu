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

const frontendOrigin = process.env.FRONTEND_URL || process.env.FRONTEND_ORIGIN || true;

const app = express();
app.set('trust proxy', 1); // Bắt buộc khi dùng cookie secure + samesite none đằng sau proxy (Railway/Vercel)
const port = Number(process.env.PORT || 4000);

app.use(cors({ 
  origin: frontendOrigin, 
  credentials: true,
  exposedHeaders: ['X-New-Access-Token', 'X-New-Refresh-Token']
}));
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'backend running' });
});

import { parseCookies } from './utils/auth';

// Debug route to inspect cookies sent by client
app.get('/debug/cookies', (req, res) => {
  const raw = req.headers.cookie || null;
  const parsed = parseCookies(raw as string | undefined);
  return res.json({ raw, parsed, origin: req.headers.origin || null });
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

// Schema được quản lý cố định bằng file backend/db/schema.sql
// và không tự động tạo khi backend khởi động.
const server = http.createServer(app);
initRealtime(server);

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

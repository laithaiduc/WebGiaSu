import { Router } from 'express';
import { getTutorById, getTutors, upsertTutorProfile } from '../services/tutors';
import { authenticateRequest } from '../utils/auth';

const router = Router();

router.get('/', async (req, res) => {
  const tutors = await getTutors({
    subject: req.query.subject ? String(req.query.subject) : undefined,
    grade: req.query.grade ? String(req.query.grade) : undefined,
    location: req.query.location ? String(req.query.location) : undefined,
    region: req.query.region ? String(req.query.region) : undefined,
    gender: req.query.gender ? String(req.query.gender) : undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
  });
  res.json({ data: tutors });
});

router.put('/profile', async (req, res) => {
  const authUser = await authenticateRequest(req, res);
  if (!authUser) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  if (authUser.role !== 'tutor') return res.status(403).json({ error: 'Chỉ gia sư mới cập nhật được hồ sơ.' });

  const { subjects, grades, location, region, price_per_hour, bio, experience_years, formats, is_accepting } = req.body;
  await upsertTutorProfile(authUser.id, {
    subjects,
    grades,
    location,
    region,
    price_per_hour: price_per_hour != null ? Number(price_per_hour) : undefined,
    bio,
    experience_years: experience_years != null ? Number(experience_years) : undefined,
    formats,
    is_accepting,
  });

  const tutor = await getTutorById(authUser.id);
  return res.json({ data: tutor });
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const tutor = await getTutorById(id);
  if (!tutor) return res.status(404).json({ error: 'Không tìm thấy gia sư.' });
  return res.json({ data: tutor });
});

export default router;

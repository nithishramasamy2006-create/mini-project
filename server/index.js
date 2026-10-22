import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRouter        from './routes/auth.js';
import applicationsRouter from './routes/applications.js';
import projectsRouter    from './routes/projects.js';
import coursesRouter     from './routes/courses.js';
import internshipsRouter from './routes/internships.js';
import mentorsRouter     from './routes/mentors.js';
import leaderboardRouter from './routes/leaderboard.js';
import companyRouter     from './routes/company.js';
import collegeRouter     from './routes/college.js';
import adminRouter       from './routes/admin.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',         authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/projects',     projectsRouter);
app.use('/api/courses',      coursesRouter);
app.use('/api/internships',  internshipsRouter);
app.use('/api/mentors',      mentorsRouter);
app.use('/api/leaderboard',  leaderboardRouter);
// ── Role portals ──────────────────────────────────────────
app.use('/api/company',      companyRouter);
app.use('/api/college',      collegeRouter);
app.use('/api/admin',        adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API ready at http://localhost:${PORT}/api`);
});

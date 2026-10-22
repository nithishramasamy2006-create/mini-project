import express from 'express';
import Project from '../models/Project.js';
const router = express.Router();

// GET all projects (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, ppo, sort, q } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (difficulty && difficulty !== 'All Levels') query.difficulty = difficulty;
    if (ppo === 'true') query.ppo = true;
    if (q) query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
      { skills: { $regex: q, $options: 'i' } },
    ];

    let projects = await Project.find(query);

    if (sort === 'stipend') {
      projects.sort((a, b) => parseInt(b.stipend.replace(/\D/g, '')) - parseInt(a.stipend.replace(/\D/g, '')));
    } else if (sort === 'rating') {
      projects.sort((a, b) => b.rating - a.rating);
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

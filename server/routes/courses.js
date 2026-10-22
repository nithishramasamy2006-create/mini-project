import express from 'express';
import Course from '../models/Course.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'all' ? { category } : {};
    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });
    if (!course) return res.status(404).json({ message: 'Not found' });
    res.json(course);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(course);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Course.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;

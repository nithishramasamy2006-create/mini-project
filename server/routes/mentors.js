import express from 'express';
import Mentor from '../models/Mentor.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { domain, q } = req.query;
    let query = {};
    if (domain && domain !== 'All Domains') query.domains = { $regex: domain.replace(' & ', ' '), $options: 'i' };
    if (q) query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
      { skills: { $regex: q, $options: 'i' } },
    ];
    const mentors = await Mentor.find(query);
    res.json(mentors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ id: req.params.id });
    if (!mentor) return res.status(404).json({ message: 'Not found' });
    res.json(mentor);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).json(mentor);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(mentor);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Mentor.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;

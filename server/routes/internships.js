import express from 'express';
import Internship from '../models/Internship.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, type, q } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (type && type !== 'All Types') query.type = type;
    if (q) query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
    ];
    const internships = await Internship.find(query);
    res.json(internships);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Internship.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const item = new Internship(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Internship.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Internship.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;

import express from 'express';
import Leaderboard from '../models/Leaderboard.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const leaders = await Leaderboard.find().sort({ rank: 1 });
    res.json(leaders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:rank', async (req, res) => {
  try {
    const entry = await Leaderboard.findOne({ rank: req.params.rank });
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const entry = new Leaderboard(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

export default router;

import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  rank: Number,
  name: String,
  college: String,
  points: Number,
  badge: String,
  avatar: String,
  grad: String,
  projects: Number,
  courses: Number,
  streak: Number,
}, { timestamps: true });

export default mongoose.model('Leaderboard', leaderboardSchema);

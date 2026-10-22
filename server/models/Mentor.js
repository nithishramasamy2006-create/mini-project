import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  id: Number,
  name: String,
  role: String,
  company: String,
  avatar: String,
  avatarGrad: String,
  skills: [String],
  rating: Number,
  mentees: Number,
  projects: Number,
  sessions: Number,
  domains: [String],
  verified: Boolean,
  available: Boolean,
  bio: String,
}, { timestamps: true });

export default mongoose.model('Mentor', mentorSchema);

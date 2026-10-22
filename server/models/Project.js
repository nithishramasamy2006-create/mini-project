import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: Number,
  title: String,
  company: String,
  companyLogo: String,
  category: String,
  difficulty: String,
  duration: String,
  stipend: String,
  skills: [String],
  description: String,
  spots: Number,
  enrolled: Number,
  rating: Number,
  reviews: Number,
  mentor: String,
  mentorRole: String,
  tags: [String],
  featured: Boolean,
  naan_aligned: Boolean,
  ppo: Boolean,
  deadline: String,
  location: String,
  color: String,
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);

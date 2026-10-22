import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  id: Number,
  title: String,
  company: String,
  logo: String,
  category: String,
  location: String,
  duration: String,
  stipend: String,
  deadline: String,
  openings: Number,
  type: String,
  skills: [String],
  ppo: Boolean,
  featured: Boolean,
  description: String,
  color: String,
}, { timestamps: true });

export default mongoose.model('Internship', internshipSchema);

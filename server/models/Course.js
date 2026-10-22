import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  instructor: String,
  company: String,
  avatar: String,
  rating: Number,
  students: Number,
  hours: Number,
  level: String,
  price: String,
  category: String,
  naan_certified: Boolean,
  coverGradient: String,
  coverIcon: String,
  skills: [String],
  description: String,
  modules: Number,
  projects: Number,
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);

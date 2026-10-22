import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // ── Who applied ─────────────────────────────────────────
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:    String,
  userEmail:   String,
  userCollege: String,
  userBranch:  String,
  userPhone:   String,

  // ── What they applied for ────────────────────────────────
  type:        { type: String, enum: ['project', 'internship', 'mentor', 'course', 'job'], required: true },
  itemId:      { type: Number, required: true },
  itemTitle:   String,
  itemCompany: String,
  company:     String,   // alias for company portal queries

  // ── Application content ──────────────────────────────────
  coverLetter: { type: String, default: '' },
  resumeLink:  { type: String, default: '' },
  skills:      [String],

  // ── Status tracking ──────────────────────────────────────
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected', 'accepted'],
    default: 'pending',
  },
  notes:       { type: String, default: '' },   // Company's internal notes
  interviewDate: { type: Date },
  offerDate:     { type: Date },

}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

// Auto-sync company field
applicationSchema.pre('save', function () {
  if (this.itemCompany && !this.company) this.company = this.itemCompany;
});

export default mongoose.model('Application', applicationSchema);

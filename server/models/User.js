import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // ── Core ───────────────────────────────────────────────
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['student', 'company', 'college', 'admin'], default: 'student' },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },

  // ── STUDENT fields ─────────────────────────────────────
  phone:      { type: String, default: '' },
  college:    { type: String, default: '' },   // college name (student's)
  year:       { type: String, default: '' },
  branch:     { type: String, default: '' },
  skills:     [String],
  cgpa:       { type: Number, default: 0 },
  linkedIn:   { type: String, default: '' },
  github:     { type: String, default: '' },
  resume:     { type: String, default: '' },
  appliedTo:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],

  // ── COMPANY fields ─────────────────────────────────────
  companyName:   { type: String, default: '' },
  industry:      { type: String, default: '' },
  website:       { type: String, default: '' },
  companySize:   { type: String, default: '' },  // e.g. "50-200"
  location:      { type: String, default: '' },
  description:   { type: String, default: '' },
  logo:          { type: String, default: '' },
  hrName:        { type: String, default: '' },
  hrPhone:       { type: String, default: '' },
  activeListings:{ type: Number, default: 0 },

  // ── COLLEGE fields ─────────────────────────────────────
  collegeName:    { type: String, default: '' },
  affiliation:    { type: String, default: '' },  // Anna University, etc.
  district:       { type: String, default: '' },
  ugcApproved:    { type: Boolean, default: true },
  naac:           { type: String, default: '' },  // NAAC grade
  studentCount:   { type: Number, default: 0 },
  tpoName:        { type: String, default: '' },
  tpoPhone:       { type: String, default: '' },

  // ── ADMIN fields ───────────────────────────────────────
  adminLevel:     { type: String, enum: ['super', 'moderator', 'support'], default: 'moderator' },
  permissions:    [String],

}, { timestamps: true });

// ── Password hash (Mongoose v7+ async, no next) ───────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Instance methods ──────────────────────────────────────
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// ── Statics ───────────────────────────────────────────────
userSchema.statics.countByRole = async function () {
  return this.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
};

export default mongoose.model('User', userSchema);

// ================================================================
// Portal Data Store — CRUD via localStorage
// All portal-created content is merged into student-facing pages
// ================================================================

export type ContentType = 'exam' | 'event' | 'course' | 'project' | 'internship' | 'job';

export const STORE_KEYS: Record<ContentType, string> = {
  exam:       'nm_portal_exams',
  event:      'nm_portal_events',
  course:     'nm_portal_courses',
  project:    'nm_portal_projects',
  internship: 'nm_portal_internships',
  job:        'nm_portal_jobs',
};

// ── Generic read ─────────────────────────────────────────────────
export function portalGetAll<T = any>(type: ContentType): T[] {
  try { return JSON.parse(localStorage.getItem(STORE_KEYS[type]) || '[]') as T[]; }
  catch { return []; }
}

// ── Generic create ────────────────────────────────────────────────
export function portalCreate<T = any>(type: ContentType, item: Record<string, any>, author?: string): T {
  const all = portalGetAll(type);
  const newItem = {
    ...item,
    id: Date.now(),
    _portal: true,
    _author: author || 'portal',
    createdAt: new Date().toISOString(),
    status: 'active',
  };
  all.push(newItem);
  localStorage.setItem(STORE_KEYS[type], JSON.stringify(all));
  return newItem as T;
}

// ── Generic update ────────────────────────────────────────────────
export function portalUpdate(type: ContentType, id: number, updates: Record<string, any>): void {
  const all = portalGetAll(type);
  const idx = all.findIndex((i: any) => i.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORE_KEYS[type], JSON.stringify(all));
  }
}

// ── Generic delete ────────────────────────────────────────────────
export function portalDelete(type: ContentType, id: number): void {
  const all = portalGetAll(type).filter((i: any) => i.id !== id);
  localStorage.setItem(STORE_KEYS[type], JSON.stringify(all));
}

// ── Toggle status (active / paused) ──────────────────────────────
export function portalToggleStatus(type: ContentType, id: number): void {
  const all = portalGetAll(type);
  const idx = all.findIndex((i: any) => i.id === id);
  if (idx !== -1) {
    (all[idx] as any).status = (all[idx] as any).status === 'active' ? 'paused' : 'active';
    localStorage.setItem(STORE_KEYS[type], JSON.stringify(all));
  }
}

// ── Filter by author (company-specific) ──────────────────────────
export function portalGetByAuthor<T = any>(type: ContentType, author: string): T[] {
  return portalGetAll<T>(type).filter((i: any) => i._author === author);
}

// ── Form field definitions per content type ───────────────────────
export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  span?: boolean; // full width
}

export const FORM_FIELDS: Record<ContentType, FieldDef[]> = {
  project: [
    { key:'title',       label:'Project Title',        required:true, span:true, placeholder:'e.g. AI Chatbot for Healthcare' },
    { key:'company',     label:'Company / Client',     required:true, placeholder:'e.g. TechCorp India' },
    { key:'category',    label:'Category',             type:'select', options:['ai','fullstack','data','cloud','cyber','iot','design','mobile'] },
    { key:'difficulty',  label:'Difficulty',           type:'select', options:['Beginner','Intermediate','Advanced','Expert'] },
    { key:'duration',    label:'Duration',             placeholder:'e.g. 6 Weeks', required:true },
    { key:'stipend',     label:'Stipend',              placeholder:'e.g. ₹10,000/month or Unpaid' },
    { key:'spots',       label:'Available Spots',      type:'number', placeholder:'e.g. 5' },
    { key:'location',    label:'Location / Mode',      placeholder:'Remote / Chennai / Hybrid' },
    { key:'deadline',    label:'Application Deadline', type:'date' },
    { key:'skills',      label:'Required Skills (comma sep)', span:true, placeholder:'React, Python, SQL' },
    { key:'description', label:'Description',          type:'textarea', span:true, required:true, placeholder:'Describe the project goals and responsibilities…' },
    { key:'ppo',         label:'PPO (Pre-Placement Offer)', type:'checkbox' },
  ],
  internship: [
    { key:'title',       label:'Internship Title',     required:true, span:true, placeholder:'e.g. Frontend Developer Intern' },
    { key:'company',     label:'Company Name',         required:true, placeholder:'e.g. Zoho Corp' },
    { key:'role',        label:'Role / Designation',   placeholder:'e.g. Software Intern' },
    { key:'location',    label:'Location',             placeholder:'Chennai / Remote / Hybrid' },
    { key:'duration',    label:'Duration',             required:true, placeholder:'e.g. 3 Months' },
    { key:'stipend',     label:'Stipend / Month',      placeholder:'e.g. ₹15,000' },
    { key:'type',        label:'Type',                 type:'select', options:['Paid','Certificate','Both'] },
    { key:'openings',    label:'No. of Openings',      type:'number', placeholder:'e.g. 3' },
    { key:'deadline',    label:'Application Deadline', type:'date' },
    { key:'skills',      label:'Skills Required (comma sep)', span:true, placeholder:'Python, Django, SQL' },
    { key:'description', label:'Description',          type:'textarea', span:true, required:true, placeholder:'Describe the internship role…' },
  ],
  job: [
    { key:'title',       label:'Job Title',            required:true, span:true, placeholder:'e.g. Software Engineer (SDE-1)' },
    { key:'company',     label:'Company Name',         required:true, placeholder:'e.g. Freshworks' },
    { key:'location',    label:'Location',             placeholder:'Chennai / Bengaluru / Remote' },
    { key:'salary',      label:'Salary / CTC',         placeholder:'e.g. ₹8–12 LPA' },
    { key:'type',        label:'Job Type',             type:'select', options:['Full-time','Part-time','Contract','Freelance'] },
    { key:'experience',  label:'Experience Required',  placeholder:'e.g. 0–1 Years / Freshers OK' },
    { key:'openings',    label:'No. of Openings',      type:'number', placeholder:'e.g. 5' },
    { key:'deadline',    label:'Application Deadline', type:'date' },
    { key:'skills',      label:'Skills Required (comma sep)', span:true, placeholder:'Java, Spring Boot, MySQL' },
    { key:'description', label:'Job Description',      type:'textarea', span:true, required:true, placeholder:'Describe the role and responsibilities…' },
  ],
  exam: [
    { key:'title',       label:'Exam Title',           required:true, span:true, placeholder:'e.g. NM Skill Assessment — AI & ML' },
    { key:'shortTitle',  label:'Short Title / Code',   placeholder:'e.g. NM-SAT-AIML' },
    { key:'category',    label:'Category',             type:'select', options:['skill-assessment','aptitude','technical','certification','government','competitive','language'] },
    { key:'organizer',   label:'Organizer',            placeholder:'e.g. NaanMudhalvan', required:true },
    { key:'mode',        label:'Mode',                 type:'select', options:['online','offline','hybrid'] },
    { key:'difficulty',  label:'Difficulty',           type:'select', options:['Easy','Moderate','Hard','Expert'] },
    { key:'examDate',    label:'Exam Date',            type:'date', required:true },
    { key:'examTime',    label:'Exam Time',            placeholder:'e.g. 10:00 AM – 12:00 PM' },
    { key:'duration',    label:'Duration',             placeholder:'e.g. 120 Minutes', required:true },
    { key:'price',       label:'Registration Fee',     placeholder:'Free or ₹199' },
    { key:'totalQuestions', label:'Total Questions',   type:'number', placeholder:'e.g. 100' },
    { key:'totalMarks',  label:'Total Marks',          type:'number', placeholder:'e.g. 100' },
    { key:'negativeMarking', label:'Negative Marking', placeholder:'0 or 0.25' },
    { key:'registrationDeadline', label:'Reg. Deadline', type:'date' },
    { key:'admitCardDate',   label:'Admit Card Date',  type:'date' },
    { key:'resultDate',      label:'Result Date',      type:'date' },
    { key:'languages',   label:'Languages',            placeholder:'English, Tamil', span:true },
    { key:'eligibilityBranches', label:'Eligible Branches (comma sep)', span:true, placeholder:'CSE, IT, ECE' },
    { key:'description', label:'Description',          type:'textarea', span:true, required:true, placeholder:'Describe the exam scope and purpose…' },
    { key:'benefits',    label:'Benefits on Passing (comma sep)', span:true, placeholder:'NM Badge, Priority project access' },
  ],
  event: [
    { key:'title',       label:'Event Title',          required:true, span:true, placeholder:'e.g. NM Hackathon 2025 — Build for TN' },
    { key:'type',        label:'Event Type',           type:'select', options:['hackathon','workshop','webinar','bootcamp','career-fair','competition','conference','guest-lecture'] },
    { key:'organizer',   label:'Organizer',            required:true, placeholder:'Company or institution name' },
    { key:'mode',        label:'Mode',                 type:'select', options:['online','offline','hybrid'] },
    { key:'date',        label:'Start Date',           type:'date', required:true },
    { key:'endDate',     label:'End Date',             type:'date' },
    { key:'time',        label:'Time',                 placeholder:'e.g. 9:00 AM' },
    { key:'duration',    label:'Duration',             placeholder:'e.g. 2 Days / 3 Hours' },
    { key:'location',    label:'Location / Platform',  placeholder:'Chennai / Zoom / Teams' },
    { key:'price',       label:'Entry Fee',            placeholder:'Free or ₹299' },
    { key:'seats',       label:'Total Seats',          type:'number', placeholder:'e.g. 500' },
    { key:'prize',       label:'Prize / Reward',       placeholder:'₹1 Lakh / Internship Offer' },
    { key:'registrationDeadline', label:'Registration Deadline', type:'date' },
    { key:'skills',      label:'Skills / Topics (comma sep)', span:true, placeholder:'Python, Design, ML' },
    { key:'description', label:'Description',          type:'textarea', span:true, required:true, placeholder:'Describe the event…' },
    { key:'featured',    label:'Feature this event (hero carousel)', type:'checkbox' },
    { key:'certificate', label:'Award certificate to participants', type:'checkbox' },
  ],
  course: [
    { key:'title',       label:'Course Title',         required:true, span:true, placeholder:'e.g. Complete Python Bootcamp for Tamil Nadu Engineers' },
    { key:'instructor',  label:'Instructor Name',      required:true, placeholder:'e.g. Dr. Anand Kumar' },
    { key:'category',    label:'Category',             type:'select', options:['web-dev','data-science','ai-ml','mobile','devops','cybersecurity','design','blockchain'] },
    { key:'level',       label:'Level',                type:'select', options:['Beginner','Intermediate','Advanced','Expert'] },
    { key:'duration',    label:'Duration',             placeholder:'e.g. 8 Weeks' },
    { key:'hours',       label:'Total Hours',          type:'number', placeholder:'e.g. 40' },
    { key:'price',       label:'Price',                placeholder:'Free or ₹999' },
    { key:'rating',      label:'Initial Rating',       placeholder:'e.g. 4.5' },
    { key:'language',    label:'Language',             placeholder:'English, Tamil' },
    { key:'skills',      label:'Skills Covered (comma sep)', span:true, placeholder:'Python, NumPy, Pandas, ML' },
    { key:'description', label:'Description',          type:'textarea', span:true, required:true, placeholder:'Describe the course content and outcomes…' },
    { key:'certificate', label:'Award certificate on completion', type:'checkbox' },
  ],
};

// ── Blank form defaults per content type ─────────────────────────
export function blankForm(type: ContentType): Record<string, any> {
  const defaults: Record<string, any> = {};
  FORM_FIELDS[type].forEach(f => {
    if (f.type === 'checkbox') defaults[f.key] = false;
    else if (f.type === 'number') defaults[f.key] = '';
    else if (f.type === 'select') defaults[f.key] = f.options?.[0] || '';
    else defaults[f.key] = '';
  });
  return defaults;
}

// ── Type colors & icons ───────────────────────────────────────────
export const TYPE_META: Record<ContentType, { color: string; icon: string; label: string }> = {
  project:    { color:'#7c3aed', icon:'🎯', label:'Project' },
  internship: { color:'#3b82f6', icon:'💼', label:'Internship' },
  job:        { color:'#10b981', icon:'🏢', label:'Job' },
  exam:       { color:'#8b5cf6', icon:'📝', label:'Exam' },
  event:      { color:'#f59e0b', icon:'🎪', label:'Event' },
  course:     { color:'#06b6d4', icon:'📚', label:'Course' },
};

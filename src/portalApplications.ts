// ================================================================
// Portal Application Pipeline — localStorage-based
// Handles applications/registrations for portal-created content
// Flow: Student applies → portal creator sees it → updates status
// ================================================================

export interface PortalApplication {
  id:          number;
  type:        'project' | 'internship' | 'job' | 'event' | 'exam';
  itemId:      number;
  itemTitle:   string;
  itemCompany: string;
  itemAuthor:  string;  // companyId / collegeId / 'admin'
  // Student details
  studentName:    string;
  studentEmail:   string;
  studentPhone:   string;
  studentCollege: string;
  studentBranch:  string;
  studentYear:    string;
  coverLetter:    string;
  resumeLink:     string;
  // Workflow
  status:     ApplicationStatus;
  appliedAt:  string;
  updatedAt?: string;
}

export type ApplicationStatus =
  | 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'hired' | 'rejected'
  | 'registered' | 'confirmed' | 'cancelled';

const KEY = 'nm_portal_applications';

// ── CRUD ──────────────────────────────────────────────────────────
export function portalAppGetAll(): PortalApplication[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function portalAppSave(
  app: Omit<PortalApplication, 'id' | 'appliedAt'>
): PortalApplication {
  const all = portalAppGetAll();
  const newApp: PortalApplication = {
    ...app,
    id:        Date.now() + Math.floor(Math.random() * 1000),
    appliedAt: new Date().toISOString(),
  };
  all.push(newApp);
  localStorage.setItem(KEY, JSON.stringify(all));
  return newApp;
}

export function portalAppGetByAuthor(authorId: string): PortalApplication[] {
  return portalAppGetAll().filter(a => a.itemAuthor === authorId);
}

export function portalAppGetByType(authorId: string, type: string): PortalApplication[] {
  return portalAppGetAll().filter(a => a.itemAuthor === authorId && a.type === type);
}

export function portalAppGetByStudent(email: string): PortalApplication[] {
  return portalAppGetAll().filter(a => a.studentEmail === email);
}

export function portalAppGetByItem(itemId: number): PortalApplication[] {
  return portalAppGetAll().filter(a => a.itemId === itemId);
}

export function portalAppUpdateStatus(id: number, status: ApplicationStatus): void {
  const all = portalAppGetAll();
  const idx = all.findIndex(a => a.id === id);
  if (idx !== -1) {
    all[idx].status    = status;
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(all));
  }
}

export function portalAppDelete(id: number): void {
  const all = portalAppGetAll().filter(a => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function portalAppHasApplied(itemId: number, studentEmail: string): boolean {
  return portalAppGetAll().some(
    a => a.itemId === itemId && a.studentEmail === studentEmail
  );
}

export function portalAppCountByItem(itemId: number): number {
  return portalAppGetAll().filter(a => a.itemId === itemId).length;
}

// ── Workflow config ───────────────────────────────────────────────
export const JOB_WORKFLOW: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'pending',     label: 'Pending',     color: '#f59e0b' },
  { status: 'reviewed',    label: 'Reviewed',    color: '#3b82f6' },
  { status: 'shortlisted', label: 'Shortlisted', color: '#7c3aed' },
  { status: 'interview',   label: 'Interview',   color: '#06b6d4' },
  { status: 'hired',       label: 'Hired ✓',    color: '#10b981' },
  { status: 'rejected',    label: 'Rejected',    color: '#ef4444' },
];

export const EVENT_WORKFLOW: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'registered',  label: 'Registered',  color: '#f59e0b' },
  { status: 'confirmed',   label: 'Confirmed ✓', color: '#10b981' },
  { status: 'cancelled',   label: 'Cancelled',   color: '#ef4444' },
];

export function workflowFor(type: string) {
  return type === 'event' || type === 'exam' ? EVENT_WORKFLOW : JOB_WORKFLOW;
}

export function statusColor(status: string): string {
  const all = [...JOB_WORKFLOW, ...EVENT_WORKFLOW];
  return all.find(w => w.status === status)?.color ?? '#888';
}

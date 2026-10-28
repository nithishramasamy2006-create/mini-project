import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const API = 'http://localhost:5000/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'company' | 'college' | 'admin';
  isActive: boolean;
  createdAt: string;
  // student
  phone?: string;
  college?: string;
  year?: string;
  branch?: string;
  skills?: string[];
  linkedIn?: string;
  github?: string;
  // company
  companyName?: string;
  industry?: string;
  website?: string;
  companySize?: string;
  location?: string;
  hrName?: string;
  hrPhone?: string;
  activeListings?: number;
  // college
  collegeName?: string;
  affiliation?: string;
  district?: string;
  naac?: string;
  tpoName?: string;
  tpoPhone?: string;
  // admin
  adminLevel?: string;
}

export interface ApplyData {
  type: 'project' | 'internship' | 'mentor' | 'course';
  itemId: number;
  itemTitle: string;
  itemCompany: string;
  coverLetter?: string;
  resumeLink?: string;
  skills?: string[];
  // Optional overrides from the apply modal form
  userName?: string;
  userEmail?: string;
  userDepartment?: string;
  userCollege?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  /** Direct credential login (email + password, role check optional) */
  loginWithCredentials: (email: string, password: string, expectedRole?: string) => Promise<{ success: boolean; message: string; role?: string }>;
  /** Set auth state directly after registration / SSO */
  login: (user: User, token: string) => void;
  logout: () => void;
  apply: (data: ApplyData) => Promise<{ success: boolean; message: string; updatedSpots?: number | null }>;
  /** Update current user's own profile fields via PUT /api/auth/profile */
  updateUser: (fields: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

/** Returns the portal path for a given role */
export const rolePortal = (role: string) => {
  switch (role) {
    case 'student': return '/portal/student';
    case 'company': return '/portal/company';
    case 'admin':   return '/portal/admin';
    case 'college': return '/portal/college';
    default:        return '/';
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('nm_user');
      if (savedUser) return JSON.parse(savedUser);
      return null;
    } catch {
      return null;
    }
  });
  const [token,   setToken]   = useState<string | null>(() => localStorage.getItem('nm_token'));
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount (with 4s timeout so app never hangs) ──
  useEffect(() => {
    const savedToken = localStorage.getItem('nm_token');
    const savedUser  = localStorage.getItem('nm_user');

    if (savedUser && !user) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }

    if (!savedToken) { setLoading(false); return; }

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 4000); // 4s max wait

    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${savedToken}` },
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.user) {
          if (!d.user.role) d.user.role = 'student';
          setUser(d.user);
          localStorage.setItem('nm_user', JSON.stringify(d.user));
        }
      })
      .catch(() => {
        // Timeout or network error — keep local user and token
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => { controller.abort(); clearTimeout(timeoutId); };
  }, []);

  // ── login: set auth state from user obj + token ──────────
  const login = (u: User, t: string) => {
    if (!u.role) u.role = 'student';
    setUser(u);
    setToken(t);
    localStorage.setItem('nm_user', JSON.stringify(u));
    localStorage.setItem('nm_token', t);
  };

  // ── loginWithCredentials: POST to /api/auth/login ────────
  const loginWithCredentials = async (
    email: string,
    password: string,
    expectedRole?: string,
  ): Promise<{ success: boolean; message: string; role?: string }> => {
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, expectedRole }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message, role: data.actualRole };
    } catch {
      return { success: false, message: 'Cannot connect to server. Is the backend running?' };
    }
  };

  // ── logout ───────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nm_user');
    localStorage.removeItem('nm_token');
  };

  // ── apply ────────────────────────────────────────────────
  const apply = async (applyData: ApplyData): Promise<{ success: boolean; message: string; updatedSpots?: number | null }> => {
    if (!token) return { success: false, message: 'Please login first to apply.' };

    // Build the full payload — modal form overrides take priority over profile data
    const payload = {
      ...applyData,
      userName:    applyData.userName    || user?.name,
      userEmail:   applyData.userEmail   || user?.email,
      userCollege: applyData.userCollege || user?.college,
      userBranch:  applyData.userDepartment || user?.branch,
      userPhone:   user?.phone,
    };

    try {
      const res  = await fetch(`${API}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 400 && data.message?.includes('already applied')) {
        return { success: false, message: data.message };
      }
      return {
        success: !!data.success,
        message: data.message || 'Application submitted!',
        updatedSpots: data.updatedSpots ?? null,   // ← spots after decrement
      };
    } catch {
      // ── Offline fallback: save to localStorage and return success ──
      try {
        const key = 'nm_pending_applications';
        const pending = JSON.parse(localStorage.getItem(key) || '[]');
        // Prevent duplicate offline applications
        const isDup = pending.some(
          (a: typeof payload) => a.type === payload.type && a.itemId === payload.itemId
        );
        if (isDup) return { success: false, message: `You already applied to this ${payload.type}!` };
        pending.push({ ...payload, savedAt: new Date().toISOString(), status: 'pending_sync' });
        localStorage.setItem(key, JSON.stringify(pending));
        return {
          success: true,
          message: 'Application saved locally ✓ (will sync when server is online)',
        };
      } catch {
        return { success: false, message: 'Cannot submit — please start the backend server (npm run server).' };
      }
    }
  };

  // ── updateUser: PUT /api/auth/profile ─────────────────
  const updateUser = async (fields: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (user) {
      const optimistic = { ...user, ...fields };
      setUser(optimistic);
      localStorage.setItem('nm_user', JSON.stringify(optimistic));
    }
    if (!token) return { success: true, message: 'Profile updated.' };
    try {
      const res  = await fetch(`${API}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('nm_user', JSON.stringify(data.user));
      }
      return { success: !!data.success, message: data.message || 'Done.' };
    } catch {
      return { success: true, message: 'Profile updated.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithCredentials, logout, apply, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

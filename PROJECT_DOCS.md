# 🎓 NaanMudhalvan Learning Marketplace
### Complete Project Documentation & Ideation

> **A full-stack learning marketplace** connecting Tamil Nadu college students with real industry projects, internships, mentors, and skill courses — powered by the Government of Tamil Nadu's Naan Mudhalvan initiative.

---

## 📌 Project Overview

| Field | Details |
|---|---|
| **Project Name** | NaanMudhalvan Learning Marketplace |
| **Type** | Full-Stack Web Application |
| **Domain** | EdTech / Career Platform |
| **Target Users** | Students, Companies, Colleges, Admins |
| **Region** | Tamil Nadu, India |
| **GitHub** | [nithishramasamy2006-create/mini-project](https://github.com/nithishramasamy2006-create/mini-project) |
| **Frontend Port** | http://localhost:8080 |
| **Backend Port** | http://localhost:5000 |

---

## 💡 Ideation & Problem Statement

### The Problem
Tamil Nadu has **5 lakh+ engineering graduates** per year, yet:
- **68% of graduates** are considered "unemployable" by industry standards
- Students learn theory but never build real products
- Companies struggle to find entry-level talent with practical experience
- Colleges have no systematic way to track student industry exposure

### The Solution
A unified **Learning-to-Earning platform** where:
- Students apply for **real micro-projects** from companies and earn stipends
- Companies get **affordable talent** without full hiring costs
- Colleges track **student progress** and industry engagement
- Government certifies skills through **NM-certified courses**

### Core Value Proposition
```
Student  → Applies for project → Earns stipend → Gets certificate → Lands job
Company  → Posts project       → Gets talent   → Converts to PPO → Saves cost
College  → Tracks students     → Shows placement rate → Improves ranking
```

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND (React SPA)                       │
│                  localhost:8080 (Vite)                       │
│                                                              │
│  Pages (18)  │  Components (11)  │  Contexts  │  Hooks      │
└───────────────────────┬──────────────────────────────────────┘
                        │  HTTP REST API (fetch + JWT)
┌───────────────────────▼──────────────────────────────────────┐
│                BACKEND (Express.js)                          │
│               localhost:5000 (Node.js)                       │
│         10 API Route Groups  │  JWT Middleware               │
└───────────────────────┬──────────────────────────────────────┘
                        │  Mongoose ODM
┌───────────────────────▼──────────────────────────────────────┐
│                DATABASE (MongoDB)                            │
│   7 Collections: Users, Projects, Applications,              │
│   Courses, Internships, Mentors, Leaderboard                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.8 | UI framework |
| **TypeScript** | ~6.0.2 | Type safety |
| **Vite** | 8.3.0 | Build tool & dev server |
| **React Router DOM** | 7.18.4 | Client-side routing |
| **Framer Motion** | 14.1.0 | Animations & transitions |
| **Lucide React** | 1.55.0 | Icon library |
| **TailwindCSS** | 4.3.3 | Utility CSS (via Vite plugin) |
| **Vanilla CSS** | — | Custom design system (`index.css`) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Express.js** | 5.3.0 | HTTP server & REST API |
| **MongoDB** | 6.x | NoSQL database |
| **Mongoose** | 9.11.1 | MongoDB ODM |
| **jsonwebtoken** | 9.x | JWT authentication |
| **bcryptjs** | 3.x | Password hashing (salt 12) |
| **dotenv** | 18.x | Environment variables |
| **cors** | 2.8.6 | Cross-Origin Resource Sharing |

### DevTools
| Tool | Purpose |
|---|---|
| **concurrently** | Run frontend + backend together (`npm run dev:all`) |
| **oxlint** | Fast JavaScript/TypeScript linter |
| **TypeScript** | Compile-time type checking |

---

## 📁 Project Structure

```
pro/
├── src/                          # Frontend source
│   ├── App.tsx                   # Root — routing, providers, code splitting
│   ├── main.tsx                  # React 19 entry point
│   ├── index.css                 # Full design system (CSS variables, components)
│   ├── AuthContext.tsx           # Auth state, JWT, apply(), profile updates
│   ├── ThemeContext.tsx          # Dark/Light mode persistence
│   ├── hooks.ts                  # Shared hooks (useDebounce, usePrevious)
│   ├── data.ts                   # Static data: Projects, Internships, Mentors
│   │
│   ├── pages/                    # 18 route-level pages (all React.lazy loaded)
│   │   ├── HomePage.tsx          # Landing page with hero, marquee, testimonials
│   │   ├── ProjectsPage.tsx      # Browse & apply for real projects (live spots)
│   │   ├── CoursesPage.tsx       # 200+ courses with sidebar filters
│   │   ├── InternshipsPage.tsx   # Paid/certificate internship listings
│   │   ├── MentorsPage.tsx       # 500+ expert mentors directory
│   │   ├── LeaderboardPage.tsx   # XP-based student rankings
│   │   ├── JobPortalPage.tsx     # Full job board
│   │   ├── CourseViewer.tsx      # In-browser video course player
│   │   ├── CertificatePage.tsx   # Government-certified certificates
│   │   ├── LoginPage.tsx         # Multi-role login
│   │   ├── RegisterPage.tsx      # Role-based registration
│   │   ├── HowItWorksPage.tsx    # Platform walkthrough
│   │   ├── PlacementSupportPage.tsx  # Career support services
│   │   ├── AlumniNetworkPage.tsx # Alumni stories & network
│   │   ├── StudentPortal.tsx     # Student dashboard
│   │   ├── CompanyPortal.tsx     # Company dashboard
│   │   ├── CollegePortal.tsx     # College dashboard
│   │   └── AdminPortal.tsx       # Admin management
│   │
│   └── components/               # 11 reusable components
│       ├── Navbar.tsx            # Responsive nav + theme toggle + user dropdown
│       ├── Footer.tsx            # Site-wide footer with CTA + links
│       ├── ApplyModal.tsx        # Application modal (form, resume upload)
│       ├── AIChatbot.tsx         # Multilingual AI chatbot (EN/Tamil/Hindi)
│       ├── Hero.tsx              # Homepage hero section
│       ├── HowItWorks.tsx        # 4-step process explainer
│       ├── Testimonials.tsx      # Student testimonials carousel
│       ├── ProjectCard.tsx       # Reusable project listing card
│       ├── ProjectsExplorer.tsx  # Filterable projects grid
│       ├── CompanyBelt.tsx       # Partner companies marquee
│       └── StarField.tsx         # Animated background star particles
│
└── server/                       # Backend source
    ├── index.js                  # Express app: CORS, routes, DB connection
    ├── .env                      # MONGO_URI, JWT_SECRET, PORT
    ├── seed.js                   # Database seeder
    ├── config/db.js              # MongoDB connection via Mongoose
    ├── middleware/auth.js        # JWT protect middleware
    ├── models/                   # 7 Mongoose schemas
    │   ├── User.js               # Multi-role user schema
    │   ├── Project.js            # Project listings with spots & enrolled
    │   ├── Application.js        # Job/project applications
    │   ├── Course.js             # Course metadata
    │   ├── Internship.js         # Internship listings
    │   ├── Mentor.js             # Mentor profiles
    │   └── Leaderboard.js        # XP scores & rankings
    └── routes/                   # 10 API route groups
        ├── auth.js               # Register, Login, /me, Profile update
        ├── applications.js       # Apply + atomic spots decrement
        ├── projects.js           # CRUD projects
        ├── courses.js            # Course listings
        ├── internships.js        # Internship listings
        ├── mentors.js            # Mentor directory
        ├── leaderboard.js        # Rankings
        ├── company.js            # Company portal APIs
        ├── college.js            # College portal APIs
        └── admin.js              # Admin management APIs
```

---

## 🗄️ Database Models

### User Model (Multi-Role)
```js
{
  // Core (all roles)
  name, email, password (bcrypt-12), role, avatar, bio, isActive, verified,

  // Student fields
  phone, college, year, branch, skills[], cgpa, linkedIn, github, resume, appliedTo[],

  // Company fields
  companyName, industry, website, companySize, location, hrName, hrPhone, activeListings,

  // College fields
  collegeName, affiliation, district, naac, tpoName, tpoPhone, studentCount,

  // Admin fields
  adminLevel ('super'|'moderator'|'support'), permissions[]
}
```

### Project Model
```js
{
  id, title, company, category, difficulty ('Beginner'|'Intermediate'|'Advanced'|'Expert'),
  duration, stipend, skills[], description,
  spots,      // decrements by 1 on each application
  enrolled,   // increments by 1 on each application
  rating, reviews, mentor, mentorRole, tags[],
  featured, naan_aligned, ppo, deadline, location, color
}
```

### Application Model
```js
{
  userId, userName, userEmail, userCollege, userBranch, userPhone,
  type: 'project' | 'internship' | 'mentor' | 'course',
  itemId, itemTitle, itemCompany,
  coverLetter, resumeLink, skills[],
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
  createdAt, updatedAt
}
```

---

## 🔌 API Reference

### Base URL: `http://localhost:5000/api`

#### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Register new user (any role) |
| `POST` | `/auth/login` | ❌ | Login — returns JWT token |
| `GET` | `/auth/me` | JWT | Restore session from token |
| `PUT` | `/auth/profile` | JWT | Update own profile fields |

#### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/applications` | JWT | Submit application + decrement spots |
| `GET` | `/applications/my` | JWT | Student's own applications |
| `GET` | `/applications` | JWT | All applications (admin) |

#### Data Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects` | All project listings |
| `GET` | `/courses` | All courses |
| `GET` | `/internships` | All internships |
| `GET` | `/mentors` | Mentor directory |
| `GET` | `/leaderboard` | Top students by XP |
| `GET` | `/company/*` | Company portal data |
| `GET` | `/college/*` | College portal data |
| `GET` | `/admin/*` | Admin management |

---

## 👥 User Roles & Portals

### Student (`/portal/student`)
- Browse 2,400+ real projects
- Apply with cover letter and resume
- Earn stipends (₹5,000–₹25,000/month)
- Enrol in 200+ free courses
- Track XP on leaderboard
- Receive government-certified certificates
- Connect with 500+ industry mentors

### Company (`/portal/company`)
- Post project and internship listings
- View and manage incoming applications
- Track enrolled students' progress
- Offer PPO (Pre-Placement Offers)
- Analytics dashboard
- Shortlist and contact candidates

### College (`/portal/college`)
- View all enrolled students
- Track placement statistics by branch
- Generate reports for NAAC/NBA
- Verify student applications
- Manage TPO activities

### Admin (`/portal/admin`)
- Full user management (activate/deactivate)
- Platform-wide analytics and reports
- Content moderation
- Leaderboard and certificate management

---

## ✨ Full Features List

### Core
- [x] Multi-role authentication (JWT, bcrypt-12)
- [x] Project marketplace with filters, search, sort
- [x] **Live spots tracking** — Atomic decrement in MongoDB on every apply
- [x] Application system with cover letter and resume upload
- [x] Offline localStorage fallback when backend is down
- [x] Course platform — 200+ courses, 6 categories, subcategory filters
- [x] In-browser course video player with progress tracking
- [x] Internship board — Paid and Certificate types
- [x] Mentor directory with booking
- [x] XP leaderboard (project +500, course +200, daily streak +10)
- [x] Full job portal
- [x] Government-certified digital certificates
- [x] Placement support (resume builder, mock interview, career guidance)
- [x] Alumni success stories network

### UI/UX
- [x] Dark / Light theme with CSS variables, persisted to localStorage
- [x] Multilingual AI Chatbot (English, Tamil, Hindi)
- [x] Fully responsive — mobile, tablet, desktop
- [x] Glassmorphism design system (frosted glass, gradients)
- [x] Framer Motion micro-animations on every interaction
- [x] Animated star-field background on hero
- [x] Partner company marquee (17 companies auto-scroll)
- [x] Apply modal with spring animations and success state
- [x] Applied badge + Fully Booked state on project cards

---

## ⚡ Performance Optimizations

| Optimization | What It Fixes |
|---|---|
| `React.lazy` code splitting (18 pages) | Only loads current page's JS chunk |
| Search debouncing at 180ms | No filter flicker on every keystroke |
| `useMemo` on all filter lists | Zero recalculation on unrelated renders |
| `useCallback` on all event handlers | Stable refs, no child re-renders |
| Removed `AnimatePresence mode="wait"` | Grid appears instantly without exit delay |
| Card stagger capped at 240ms | Last card animates in under 0.25s |
| Always-mounted modals (`open` prop) | No re-mount flicker on open |
| 4-second session restore timeout | App never hangs if backend is slow |
| `AbortController` on all fetches | Clean cancellation on unmount |
| Vite manual chunk splitting | react, router, motion, icons cached separately |
| Vite cache cleared on start | No stale dependency conflicts |

---

## 🐛 Bugs Fixed

| # | Bug | Fix |
|---|---|---|
| 1 | Port drift: app ran on 8081, browser opened 8080 | `strictPort:true`, `open:true`, killed ghost process |
| 2 | "Network error" on every Apply click | localStorage offline fallback added |
| 3 | Form fields (name, email, college) ignored in apply payload | Pass all fields from modal to `apply()` |
| 4 | Duplicate `@keyframes` causing CSS conflicts | Removed duplicate block in `index.css` |
| 5 | `mesh-bg` overflowed section boundaries | Added `position:relative` to `.section` |
| 6 | Footer invisible in light mode | Replaced hardcoded dark hex with CSS variables |
| 7 | Company SVG logos invisible in dark mode | White pill background wrapper |
| 8 | "Deemed University" duplicated in register dropdown | Replaced duplicate with "Central University" |
| 9 | Footer CTA linked to wrong pages | Fixed to `/register` and `/portal/company` |
| 10 | Spots counter never decreased after applying | Atomic MongoDB `$inc`, optimistic frontend update |
| 11 | InternshipsPage filter recalculated on every render | Wrapped in `useMemo` |
| 12 | Session restore blocked UI indefinitely | `AbortController` with 4-second timeout |

---

## 🚀 How to Run

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (port 27017)
- npm ≥ 9

### Setup
```bash
# 1. Clone
git clone https://github.com/nithishramasamy2006-create/mini-project.git
cd mini-project

# 2. Install all dependencies
npm install
cd server && npm install && cd ..

# 3. Configure server/.env
MONGO_URI=mongodb://localhost:27017/naanmudhalvan
JWT_SECRET=your_super_secret_key_here
PORT=5000

# 4. (Optional) Seed demo data
cd server && node seed.js && cd ..
```

### Run (Development)
```bash
# Run BOTH frontend + backend together
npm run dev:all

# Or separately
npm run dev       # Frontend → http://localhost:8080 (auto-opens)
npm run server    # Backend  → http://localhost:5000
```

### Build (Production)
```bash
npm run build    # TypeScript + Vite bundle with chunk splitting
npm run preview  # Preview production build
```

---

## 🗺️ All Routes

| Route | Page | Auth |
|---|---|---|
| `/` | HomePage | Public |
| `/projects` | ProjectsPage | Public |
| `/courses` | CoursesPage | Public |
| `/internships` | InternshipsPage | Public |
| `/mentors` | MentorsPage | Public |
| `/leaderboard` | LeaderboardPage | Public |
| `/jobs` | JobPortalPage | Public |
| `/certificates` | CertificatePage | Public |
| `/how-it-works` | HowItWorksPage | Public |
| `/placement-support` | PlacementSupportPage | Public |
| `/alumni-network` | AlumniNetworkPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/learn/:courseId` | CourseViewer | Public |
| `/portal/student` | StudentPortal | Student |
| `/portal/company` | CompanyPortal | Company |
| `/portal/college` | CollegePortal | College |
| `/portal/admin` | AdminPortal | Admin |

---

## 📊 Platform Statistics (Demo Data)

| Metric | Value |
|---|---|
| Active Projects | 2,400+ |
| Partner Companies | 180+ |
| Enrolled Students | 45,000+ |
| Courses Available | 200+ |
| Expert Mentors | 500+ |
| Active Internships | 840+ |
| Max Stipend | ₹25,000/month |
| Average Stipend | ₹12,000–₹18,000/month |
| Completion Rate | 94% |
| Pre-Placement Rate | 72% |
| Certificate Processing | 3 business days |

---

## 🔮 Future Roadmap

### Phase 2 — Next Sprint
- [ ] Real-time notifications with Socket.io
- [ ] Email alerts for application status (NodeMailer)
- [ ] File upload to cloud (Multer + Cloudinary)
- [ ] Resume PDF parser using AI
- [ ] Payment gateway (Razorpay) for premium courses

### Phase 3 — Mid-term
- [ ] React Native mobile app
- [ ] AI-based student-project matching (ML)
- [ ] GitHub integration for progress tracking
- [ ] Full LMS with quizzes and assignments
- [ ] Blockchain-verified NFT certificates
- [ ] Tamil and Hindi full UI translations

### Phase 4 — Long-term
- [ ] Expand to all Indian states
- [ ] Proctored AI-monitored skill assessments
- [ ] Alumni-to-student automated mentorship matching
- [ ] B2B API marketplace for company talent sourcing

---

## 👨‍💻 Developer

| | |
|---|---|
| **Developer** | Nithish Ramasamy |
| **College** | Bannari Amman Institute of Technology |
| **Branch** | B.Tech Information Technology |
| **GitHub** | github.com/nithishramasamy2006-create |

---

*Built with love for Tamil Nadu students — NaanMudhalvan Learning Marketplace © 2024*

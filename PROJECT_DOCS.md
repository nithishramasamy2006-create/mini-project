# 🎓 NaanMudhalvan Learning Marketplace
### Complete Project Documentation & Ideation — v2.0

> **A full-stack learning marketplace** connecting Tamil Nadu college students with real industry projects, internships, mentors, skill courses, events, and certified exams — powered by the Government of Tamil Nadu's Naan Mudhalvan initiative.

---

## 📌 Project Overview

| Field | Details |
|---|---|
| **Project Name** | NaanMudhalvan Learning Marketplace |
| **Version** | 2.0 (October 2025) |
| **Type** | Full-Stack Web Application |
| **Domain** | EdTech / Career Platform |
| **Target Users** | Students, Companies, Colleges, Admins |
| **Region** | Tamil Nadu, India |
| **GitHub** | [nithishramasamy2006-create/mini-project](https://github.com/nithishramasamy2006-create/mini-project) |
| **Frontend Port** | http://localhost:8080 |
| **Backend Port** | http://localhost:5000 |
| **Last Updated** | October 22, 2025 |

---

## 💡 Ideation & Problem Statement

### The Problem
Tamil Nadu has **5 lakh+ engineering graduates** per year, yet:
- **68% of graduates** are considered "unemployable" by industry standards
- Students learn theory but never build real products
- Companies struggle to find entry-level talent with practical experience
- Colleges have no systematic way to track student industry exposure
- No unified platform for skill exams, events, and project experience

### The Solution
A unified **Learning-to-Earning platform** where:
- Students apply for **real micro-projects** from companies and earn stipends
- Companies get **affordable talent** without full hiring costs
- Colleges track **student progress** and industry engagement
- Government certifies skills through **NM-certified courses & exams**
- Students discover **hackathons, workshops, webinars** and register instantly
- Students take **online & offline skill exams** at 10+ TN centers

### Core Value Proposition
```
Student  → Applies for project → Earns stipend → Gets certificate → Lands job
Company  → Posts project       → Gets talent   → Converts to PPO → Saves cost
College  → Tracks students     → Shows placement rate → Improves ranking
Student  → Registers for exam  → Gets NM badge → Priority project access
Student  → Attends event/hackathon → Wins prize → Builds portfolio
```

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   FRONTEND (React SPA)                           │
│                  localhost:8080 (Vite)                           │
│                                                                  │
│  Pages (22)  │  Components (11)  │  Contexts  │  Hooks          │
│  Data Files: data.ts, courseData.ts, eventsData.ts, examData.ts │
└───────────────────────┬──────────────────────────────────────────┘
                        │  HTTP REST API (fetch + JWT)
┌───────────────────────▼──────────────────────────────────────────┐
│                BACKEND (Express.js)                              │
│               localhost:5000 (Node.js)                           │
│         10 API Route Groups  │  JWT Middleware                   │
└───────────────────────┬──────────────────────────────────────────┘
                        │  Mongoose ODM
┌───────────────────────▼──────────────────────────────────────────┐
│                DATABASE (MongoDB)                                │
│   7 Collections: Users, Projects, Applications,                  │
│   Courses, Internships, Mentors, Leaderboard                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.8 | UI framework |
| **TypeScript** | ~6.0.2 | Type safety |
| **Vite** | 8.3.0 | Build tool & dev server (port 8080, strictPort) |
| **React Router DOM** | 7.18.4 | Client-side routing (22 routes) |
| **Framer Motion** | 14.1.0 | Animations & transitions |
| **Lucide React** | 1.55.0 | Icon library |
| **Vanilla CSS** | — | Custom design system (`index.css`) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Express.js** | 5.3.0 | HTTP server & REST API |
| **MongoDB** | 6.x | NoSQL database |
| **Mongoose** | 9.11.1 | MongoDB ODM |
| **jsonwebtoken** | 9.x | JWT authentication |
| **bcryptjs** | 3.x | Password hashing (salt rounds: 12) |
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
├── src/                              # Frontend source
│   ├── App.tsx                       # Root — routing, providers, code splitting
│   ├── main.tsx                      # React 19 entry point
│   ├── index.css                     # Full design system (CSS variables, components)
│   ├── AuthContext.tsx               # Auth state, JWT, apply(), profile updates
│   ├── ThemeContext.tsx              # Dark/Light mode persistence
│   ├── hooks.ts                      # Shared hooks (useDebounce, usePrevious)
│   │
│   ├── data.ts                       # Projects, Internships, Mentors, NAV_ITEMS
│   ├── courseData.ts                 # 200+ courses across 6 categories
│   ├── eventsData.ts                 # 12 events: hackathons, workshops, webinars
│   └── examData.ts                   # 9 exams + 10 TN offline centers
│   │
│   ├── pages/                        # 22 route-level pages (all React.lazy loaded)
│   │   ├── HomePage.tsx              # Landing page with hero, marquee, testimonials
│   │   ├── ProjectsPage.tsx          # Browse & apply for real projects (live spots + bookmark)
│   │   ├── CoursesPage.tsx           # 200+ courses, sidebar tabs (Profile/Wishlist/Reviews/Q&A)
│   │   ├── InternshipsPage.tsx       # Paid/certificate internship listings
│   │   ├── MentorsPage.tsx           # 500+ expert mentors directory
│   │   ├── LeaderboardPage.tsx       # XP-based student rankings
│   │   ├── JobPortalPage.tsx         # Full job board
│   │   ├── EventsPage.tsx            # ✨ NEW: 12 events with registration modal
│   │   ├── ExamPortalPage.tsx        # ✨ NEW: 9 exams, online/offline, center selection
│   │   ├── CourseViewer.tsx          # In-browser video course player
│   │   ├── CertificatePage.tsx       # Government-certified certificates
│   │   ├── LoginPage.tsx             # Multi-role login
│   │   ├── RegisterPage.tsx          # Role-based registration
│   │   ├── HowItWorksPage.tsx        # Platform walkthrough
│   │   ├── PlacementSupportPage.tsx  # Career support services
│   │   ├── AlumniNetworkPage.tsx     # Alumni stories & network
│   │   ├── StudentPortal.tsx         # Student dashboard
│   │   ├── CompanyPortal.tsx         # Company dashboard
│   │   ├── CollegePortal.tsx         # College dashboard
│   │   └── AdminPortal.tsx           # Admin management
│   │
│   └── components/                   # 11 reusable components
│       ├── Navbar.tsx                # Responsive nav + theme toggle + user dropdown
│       ├── Footer.tsx                # Site-wide footer with CTA + links
│       ├── ApplyModal.tsx            # Application modal (form, onSuccess callback)
│       ├── AIChatbot.tsx             # Multilingual AI chatbot (EN/Tamil/Hindi)
│       ├── Hero.tsx                  # Homepage hero section
│       ├── HowItWorks.tsx            # 4-step process explainer
│       ├── Testimonials.tsx          # Student testimonials carousel
│       ├── ProjectCard.tsx           # Reusable project listing card
│       ├── ProjectsExplorer.tsx      # Filterable projects grid
│       ├── CompanyBelt.tsx           # Partner companies marquee
│       └── StarField.tsx             # Animated background star particles
│
└── server/                           # Backend source
    ├── index.js                      # Express app: CORS, routes, DB connection
    ├── .env                          # MONGO_URI, JWT_SECRET, PORT
    ├── seed.js                       # Database seeder
    ├── config/db.js                  # MongoDB connection via Mongoose
    ├── middleware/auth.js            # JWT protect middleware
    ├── models/                       # 7 Mongoose schemas
    │   ├── User.js                   # Multi-role user schema
    │   ├── Project.js                # Project listings with spots & enrolled
    │   ├── Application.js            # Job/project applications
    │   ├── Course.js                 # Course metadata
    │   ├── Internship.js             # Internship listings
    │   ├── Mentor.js                 # Mentor profiles
    │   └── Leaderboard.js            # XP scores & rankings
    └── routes/                       # 10 API route groups
        ├── auth.js                   # Register, Login, /me, Profile update
        ├── applications.js           # Apply + atomic spots decrement
        ├── projects.js               # CRUD projects
        ├── courses.js                # Course listings
        ├── internships.js            # Internship listings
        ├── mentors.js                # Mentor directory
        ├── leaderboard.js            # Rankings
        ├── company.js                # Company portal APIs
        ├── college.js                # College portal APIs
        └── admin.js                  # Admin management APIs
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
  spots,      // decrements by 1 atomically on each application ($inc: -1)
  enrolled,   // increments by 1 atomically on each application ($inc: +1)
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

## 📋 Data Files (Frontend Static Data)

### `eventsData.ts` — 12 Events
| Field | Description |
|---|---|
| `type` | hackathon / workshop / webinar / bootcamp / career-fair / competition / conference / guest-lecture |
| `mode` | online / offline / hybrid |
| `date` + `endDate` | Single or multi-day events |
| `seats` + `seatsLeft` | For seats progress bar |
| `price` | `"Free"` or `"₹199"` |
| `registrationDeadline` | Countdown urgency label |
| `skills[]` | Skill tags per event |
| `speakers[]` | Name, role, company |
| `prize` | Hackathon/competition prize pool |
| `certificate` | 🏅 badge on card |
| `organizer` + `organizerLogo` | Company name + emoji |
| `featured` | Shown in featured hero row |

### `examData.ts` — 9 Exams + 10 TN Centers
| Field | Description |
|---|---|
| `mode` | online / offline / hybrid |
| `examDate`, `examTime`, `duration` | Scheduled exam info |
| `registrationDeadline`, `admitCardDate`, `resultDate` | Key lifecycle dates |
| `pattern` | Total Qs, Marks, duration, negative marking, sections[] |
| `syllabus[]` | Unit → topics[] → marks (expandable in UI) |
| `centers[]` | Offline venue list — city, venue, address, landmark, pincode, phone, seats |
| `eligibility` | branches[], years[], minCGPA, others[] |
| `languages` | Tamil / English / both |
| `difficulty` | Easy → Moderate → Hard → Expert |
| `status` | open / closing-soon / closed / upcoming / result-declared |
| `benefits[]` | Rewards on passing |

### TN Offline Exam Centers (10 Cities)
| Center | City | Venue |
|---|---|---|
| chn-01 | Chennai | Anna University – CEG Campus |
| chn-02 | Chennai | SRM Institute of Science & Technology |
| cbe-01 | Coimbatore | PSG College of Technology |
| cbe-02 | Coimbatore | Amrita School of Engineering |
| mdu-01 | Madurai | Thiagarajar College of Engineering |
| try-01 | Trichy | NIT Trichy |
| sal-01 | Salem | Salem Engineering College |
| vellore-01 | Vellore | VIT University |
| erode-01 | Erode | Bannari Amman Institute of Technology |
| tvm-01 | Tirunelveli | Manonmaniam Sundaranar University |

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
| `POST` | `/applications` | JWT | Submit application + atomic spots decrement |
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
- Save courses to Wishlist (localStorage)
- Bookmark projects (localStorage)
- Track XP on leaderboard
- Register for events & hackathons
- Take online/offline skill assessment exams
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

### Core Platform
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
- [x] Full job portal with company filters
- [x] Government-certified digital certificates
- [x] Placement support (resume builder, mock interview, career guidance)
- [x] Alumni success stories network

### ✨ New in v2.0

#### Events Page (`/events`)
- [x] 12 events: Hackathons, Workshops, Webinars, Bootcamps, Career Fairs, Competitions, Conferences, Guest Lectures
- [x] Featured events hero carousel
- [x] Filter by type (8 types), mode (Online/Offline/Hybrid), price (Free/Paid)
- [x] Debounced search across title, skills, organizer, tags, location
- [x] Seats progress bar (turns red when >80% filled)
- [x] Urgency deadline label ("Last Day!", "3d left", "12 days left")
- [x] Prize pool display for hackathons
- [x] Bookmark/save events to localStorage
- [x] Full registration modal: name, email, college, branch, year, phone, motivation
- [x] Registration success screen with confirmation details
- [x] "✓ Registered" badge persisted across sessions (localStorage)
- [x] Speaker profiles per event
- [x] Certificate badge indicator

#### Exam Portal (`/exams`)
- [x] 9 exams across 7 categories (Skill Assessment, Aptitude, Technical, Certification, Government, Competitive, Language)
- [x] Online / Offline / Hybrid mode support
- [x] **10 physical exam centers** across Tamil Nadu with full venue details
- [x] Category filter (8 types), mode filter, price filter
- [x] Debounced search
- [x] Expandable syllabus accordion per exam
- [x] Exam pattern: total questions, marks, duration, negative marking, sections breakdown
- [x] Eligibility tags: branches, years, min CGPA
- [x] Difficulty badge: Easy → Moderate → Hard → Expert
- [x] Status badges: Open / Closing Soon / Closed / Upcoming / Result Declared
- [x] Registration progress bar per exam
- [x] Multi-step registration modal:
  - **Online exam:** Exam Info → Personal Details → Review → ✅ Success
  - **Offline exam:** Exam Info → Choose Center (with map link, seats bar) → Personal Details → Review → ✅ Success
- [x] Registration number generated and shown on success
- [x] Key dates shown: admit card date, result date, exam date/time
- [x] Scrolling center marquee strip at page top
- [x] "Download Admit Card" action on success screen

#### CoursesPage Sidebar Fixes
- [x] Sidebar nav tabs now work (My Profile / Courses / Wishlist / Reviews / Q&A)
- [x] Profile tab: shows user info grid (name, email, college, branch, year, role)
- [x] Wishlist tab: shows saved courses grid with red count badge, Remove button
- [x] Wishlist persisted to `localStorage` key `nm_wishlist`
- [x] Reviews tab: placeholder with empty state CTA
- [x] Q&A tab: placeholder with empty state CTA

#### ProjectsPage Bookmark
- [x] Bookmark button now toggles filled/outline icon
- [x] Saved state: violet border + violet filled icon
- [x] Bookmarks persisted to `localStorage` key `nm_saved_projects`
- [x] `e.stopPropagation()` — bookmark doesn't trigger apply modal

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
| `React.lazy` code splitting (22 pages) | Only loads current page's JS chunk |
| Search debouncing at 180ms | No filter flicker on every keystroke |
| `useMemo` on all filter lists | Zero recalculation on unrelated renders |
| `useCallback` on all event handlers | Stable refs, no child re-renders |
| Removed `AnimatePresence mode="wait"` | Grid appears instantly without exit delay |
| Card stagger capped at 240ms | Last card animates in under 0.25s |
| Always-mounted modals (`open` prop) | No re-mount flicker on open |
| 4-second session restore timeout | App never hangs if backend is slow |
| `AbortController` on all fetches | Clean cancellation on unmount |
| Vite manual chunk splitting | react, router, motion, icons cached separately |
| `localStorage` for wishlist/bookmarks | Instant state restore without API |

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
| 13 | Sidebar nav items (My Profile, Wishlist, etc.) did nothing | Replaced dead `NavLink` hash routes with `activeView` tab state |
| 14 | Wishlist state reset on every page refresh | Persisted to `localStorage` (`nm_wishlist`) |
| 15 | Bookmark button on project cards had no onClick | Wired `toggleSave` with localStorage persistence |
| 16 | Bookmark click opened apply modal | Added `e.stopPropagation()` to bookmark handler |

---

## 🗺️ All Routes

| Route | Page | Auth | Status |
|---|---|---|---|
| `/` | HomePage | Public | ✅ Live |
| `/projects` | ProjectsPage | Public | ✅ Live |
| `/courses` | CoursesPage | Public | ✅ Live |
| `/internships` | InternshipsPage | Public | ✅ Live |
| `/events` | EventsPage | Public | ✅ **NEW** |
| `/exams` | ExamPortalPage | Public | ✅ **NEW** |
| `/mentors` | MentorsPage | Public | ✅ Live |
| `/leaderboard` | LeaderboardPage | Public | ✅ Live |
| `/jobs` | JobPortalPage | Public | ✅ Live |
| `/certificates` | CertificatePage | Public | ✅ Live |
| `/how-it-works` | HowItWorksPage | Public | ✅ Live |
| `/placement-support` | PlacementSupportPage | Public | ✅ Live |
| `/alumni-network` | AlumniNetworkPage | Public | ✅ Live |
| `/login` | LoginPage | Public | ✅ Live |
| `/register` | RegisterPage | Public | ✅ Live |
| `/learn/:courseId` | CourseViewer | Public | ✅ Live |
| `/portal/student` | StudentPortal | Student | ✅ Live |
| `/portal/company` | CompanyPortal | Company | ✅ Live |
| `/portal/college` | CollegePortal | College | ✅ Live |
| `/portal/admin` | AdminPortal | Admin | ✅ Live |

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
| Events Listed | 12 |
| Exam Certifications | 9 |
| Offline Exam Centers | 10 (across TN) |
| Max Stipend | ₹25,000/month |
| Average Stipend | ₹12,000–₹18,000/month |
| Total Prize Pool (Events) | ₹6.5 Lakh+ |
| Completion Rate | 94% |
| Pre-Placement Rate | 72% |
| Certificate Processing | 3 business days |

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

## 🔮 Future Roadmap

### Phase 2 — Next Sprint
- [ ] Real-time notifications with Socket.io
- [ ] Email alerts for application status (NodeMailer)
- [ ] File upload to cloud (Multer + Cloudinary)
- [ ] Resume PDF parser using AI
- [ ] Payment gateway (Razorpay) for paid exams & events
- [ ] Proctored online exam with webcam monitoring
- [ ] Admit card PDF generation and download

### Phase 3 — Mid-term
- [ ] React Native mobile app
- [ ] AI-based student-project matching (ML)
- [ ] GitHub integration for progress tracking
- [ ] Full LMS with quizzes and assignments
- [ ] Blockchain-verified NFT certificates
- [ ] Tamil and Hindi full UI translations
- [ ] Offline exam hall ticket system (QR code scan)
- [ ] Live leaderboard during hackathons/competitions

### Phase 4 — Long-term
- [ ] Expand to all Indian states
- [ ] Alumni-to-student automated mentorship matching
- [ ] B2B API marketplace for company talent sourcing
- [ ] Company recruitment analytics dashboard

---

## 🔑 localStorage Keys Reference

| Key | Description | Used By |
|---|---|---|
| `nm_wishlist` | Saved course IDs (JSON array) | CoursesPage |
| `nm_saved_projects` | Bookmarked project IDs (JSON array) | ProjectsPage |
| `nm_saved_events` | Bookmarked event IDs (JSON array) | EventsPage |
| `nm_registered_events` | Registered event objects | EventsPage |
| `nm_registered_events` (ids) | Registered event IDs for badge | EventsPage |
| `nm_exam_registrations` | Exam registration objects with regNo | ExamPortalPage |
| `nm_token` | JWT auth token | AuthContext |
| `nm_theme` | 'dark' \| 'light' preference | ThemeContext |

---

## 👨‍💻 Developer

| | |
|---|---|
| **Developer** | Nithish Ramasamy |
| **College** | Bannari Amman Institute of Technology |
| **Branch** | B.Tech Information Technology |
| **GitHub** | [nithishramasamy2006-create](https://github.com/nithishramasamy2006-create) |

---

*Built with ❤️ for Tamil Nadu students — NaanMudhalvan Learning Marketplace © 2025 — v2.0*

# NaanMudhalvan — MongoDB Backend

## 🗄️ Database
- **Name**: `naanmudhalvan`
- **Connection**: `mongodb://localhost:27017`
- **Collections**: projects, courses, internships, mentors, leaderboards

## 🚀 Start the API Server
```bash
cd server
node index.js
```
Server runs at: **http://localhost:5000**

## 🌱 Re-seed the Database
```bash
cd server
node seed.js
```

## 📡 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/health | Health check |
| GET | /api/projects | All projects (supports `?category=ai&difficulty=Intermediate&ppo=true&sort=stipend&q=search`) |
| GET | /api/projects/:id | Single project |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/courses | All courses (`?category=ai`) |
| GET | /api/courses/:id | Single course |
| GET | /api/internships | All internships (`?category=ai&type=Paid&q=search`) |
| GET | /api/mentors | All mentors (`?domain=AI+%26+ML&q=search`) |
| GET | /api/leaderboard | Leaderboard sorted by rank |

## 🔗 View in MongoDB Compass
1. Open **MongoDB Compass** on your desktop
2. Connect to: `mongodb://localhost:27017`
3. Select database: `naanmudhalvan`

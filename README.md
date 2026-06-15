# 📋 Kanban Task Manager

A full-stack **Mini Kanban Task Manager** built with **React** (frontend) and **Node.js + Express** (backend).

---

## 🚀 Features

- ✅ **Create tasks** — with title validation (non-empty, ≤200 chars)
- 📋 **View tasks** — grouped into **To Do** and **Done** columns
- 🔄 **Move tasks** — toggle between `To Do ↔ Done`
- 🗑️ **Delete tasks** — with two-step confirmation to prevent accidents
- ⏳ **Loading skeleton** — while fetching tasks
- ❌ **Error handling** — global banner + per-task inline errors with retry
- 📊 **Progress bar** — shows % of tasks completed
- 📱 **Responsive** — works on mobile and desktop

---

## 🗂️ Project Structure

```
kanban-task-manager/
├── backend/
│   ├── server.js              # Express server — API + serves React build in production
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── tasksApi.js        # Centralised fetch layer
│   │   ├── hooks/
│   │   │   └── useTasks.js        # Custom React hook (useState, useEffect)
│   │   ├── components/
│   │   │   ├── AddTaskForm.jsx    # Form with char count + validation
│   │   │   ├── KanbanColumn.jsx   # Column (header, tasks, empty state)
│   │   │   └── TaskCard.jsx       # Individual task card with actions
│   │   ├── App.jsx                # Root component
│   │   ├── App.css                # All component styles
│   │   └── index.css              # Global reset & design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
├── package.json                   # Root build & start scripts
├── .gitignore
└── README.md
```

---

## 🛠️ Local Development Setup

### Step 1 — Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2 — Run both servers

Open **two terminals**:

```bash
# Terminal 1 — Backend (runs on http://localhost:5000)
cd backend
node server.js
```

```bash
# Terminal 2 — Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

> The Vite dev server proxies all `/tasks` API calls to the backend on `:5000` automatically — no CORS issues.

---

## 🔌 API Reference

| Method | Endpoint      | Description       | Body                    |
|--------|---------------|-------------------|-------------------------|
| GET    | `/tasks`      | Get all tasks     | —                       |
| POST   | `/tasks`      | Create a new task | `{ "title": "..." }`   |
| PUT    | `/tasks/:id`  | Update task status | `{ "status": "done" }` |
| DELETE | `/tasks/:id`  | Delete a task     | —                       |

### Data Shape

```json
{
  "id": 1,
  "title": "Buy milk",
  "status": "todo"
}
```

### Validation Rules

- `title` — required, non-empty string, max 200 characters
- `status` — must be `"todo"` or `"done"`
- Invalid or missing `id` → `400`; not found → `404`

### Response Format

All responses follow:
```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```
On error:
```json
{
  "success": false,
  "error": "Description of what went wrong."
}
```

---

## 📦 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite                          |
| Styling   | Vanilla CSS (dark theme, animations)    |
| Backend   | Node.js, Express 5                      |
| Data      | In-memory array (no database)           |
| HTTP      | Native `fetch` API                      |

---

## 🌐 Production Deployment (Render — Single Platform)

In production, Express **serves the React build directly** — one server, one URL, no CORS.

```
Browser → Render (Node.js Service)
              ├── GET /          → React app (index.html)
              ├── GET /assets/*  → JS/CSS bundles
              ├── GET /tasks     → Express API
              └── POST/PUT/DELETE /tasks/:id → Express API
```

### Deploy Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "feat: kanban task manager"
   git remote add origin https://github.com/YOUR_USERNAME/kanban-task-manager.git
   git branch -M main
   git push -u origin main
   ```

2. **Create a Web Service on [render.com](https://render.com)**

   | Field | Value |
   |---|---|
   | Runtime | `Node` |
   | Build Command | `npm run build` |
   | Start Command | `npm start` |
   | Instance Type | `Free` |

3. **Environment Variables on Render**

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |

4. Click **Deploy** → your live URL:
   ```
   https://kanban-task-manager.onrender.com
   ```

> ⚠️ Render free tier sleeps after 15 min of inactivity. First request after sleep takes ~30 sec to wake up.

---

## ✅ Edge Cases Covered

- Empty title blocked on both client-side AND server-side
- Whitespace-only title trimmed and rejected
- Title > 200 chars rejected with clear error message
- Invalid task IDs (NaN, negative) → `400`
- Non-existent task IDs → `404`
- Invalid status values → `400`
- Missing status in PUT body → `400`
- Two-step delete confirmation prevents accidental deletion
- Per-task loading state prevents double-clicking during API calls
- Global error banner with retry on network failure
- Empty columns show descriptive placeholder messages
- Character counter warns before hitting the 200 char limit

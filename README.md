# Kanban Task Manager

A mini Kanban board built with React and Node.js + Express. Tasks are organized into two columns — **To Do** and **Done**.

**Live Demo:** https://kanban-task-manager-xxvn.onrender.com

---

## Features

- Add new tasks
- Move tasks between To Do and Done
- Delete tasks (with confirmation)
- Loading state while fetching
- Error handling with retry
- Responsive layout

---

## Project Structure

```
kanban-task-manager/
├── backend/
│   ├── server.js          # Express API + serves React build in production
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── api/tasksApi.js          # API calls (fetch)
│   │   ├── hooks/useTasks.js        # Custom hook (useState, useEffect)
│   │   ├── components/
│   │   │   ├── AddTaskForm.jsx
│   │   │   ├── KanbanColumn.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Vanilla CSS |
| Backend | Node.js, Express |
| Data | In-memory array |
| HTTP | Native fetch API |

---

## Local Setup

**Install dependencies:**

```bash
cd backend && npm install
cd ../frontend && npm install
```

**Run (two terminals):**

```bash
# Terminal 1 - Backend on http://localhost:5000
cd backend
node server.js
```

```bash
# Terminal 2 - Frontend on http://localhost:5173
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint | Description | Body |
|---|---|---|---|
| GET | `/tasks` | Get all tasks | — |
| POST | `/tasks` | Create a task | `{ "title": "..." }` |
| PUT | `/tasks/:id` | Update status | `{ "status": "done" }` |
| DELETE | `/tasks/:id` | Delete a task | — |

**Task shape:**
```json
{
  "id": 1,
  "title": "Buy milk",
  "status": "todo"
}
```

**Validation:**
- `title` is required, max 200 characters
- `status` must be `"todo"` or `"done"`
- Invalid ID → `400`, not found → `404`

---

## Deployment

Deployed on **Render** — Express serves both the API and the React build from a single Node.js service.

**Environment variables set on Render:**

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

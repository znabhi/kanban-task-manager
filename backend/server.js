const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
// In production: frontend is served from this same server → no CORS needed.
// In development: Vite dev server runs on :5173 with a proxy, also no CORS needed.
app.use(cors());
app.use(express.json());

// ─── Serve React Build (Production) ───────────────────────────────────────────
const FRONTEND_DIST = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(FRONTEND_DIST));

// ─── In-Memory Data Store ──────────────────────────────────────────────────────
let tasks = [
  { id: 1, title: "Research project requirements", status: "done" },
  { id: 2, title: "Set up development environment", status: "done" },
  { id: 3, title: "Design database schema", status: "todo" },
  { id: 4, title: "Write unit tests", status: "todo" },
];
let nextId = 5;

// ─── Helper: validate status ───────────────────────────────────────────────────
const VALID_STATUSES = ["todo", "done"];
const isValidStatus = (s) => VALID_STATUSES.includes(s);

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /tasks
 * Returns all tasks.
 */
app.get("/tasks", (req, res) => {
  res.status(200).json({
    success: true,
    data: tasks,
    count: tasks.length,
  });
});

/**
 * POST /tasks
 * Creates a new task with default status "todo".
 * Body: { title: string }
 */
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validation: title must exist and not be empty/whitespace
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Title is required and must be a non-empty string.",
    });
  }

  // Validation: title max length guard
  if (title.trim().length > 200) {
    return res.status(400).json({
      success: false,
      error: "Title must not exceed 200 characters.",
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    status: "todo",
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully.",
  });
});

/**
 * PUT /tasks/:id
 * Updates a task's status.
 * Body: { status: "todo" | "done" }
 */
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Validate id is a valid number
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: "Task ID must be a positive integer.",
    });
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Task with id ${id} not found.`,
    });
  }

  const { status } = req.body;

  // Validation: status must be present
  if (status === undefined || status === null) {
    return res.status(400).json({
      success: false,
      error: 'Status is required. Must be "todo" or "done".',
    });
  }

  // Validation: status must be valid
  if (!isValidStatus(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status "${status}". Must be "todo" or "done".`,
    });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], status };

  res.status(200).json({
    success: true,
    data: tasks[taskIndex],
    message: "Task updated successfully.",
  });
});

/**
 * DELETE /tasks/:id
 * Deletes a task by ID.
 */
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Validate id is a valid number
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: "Task ID must be a positive integer.",
    });
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Task with id ${id} not found.`,
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    data: deletedTask,
    message: "Task deleted successfully.",
  });
});

// ─── SPA Fallback — Send index.html for any non-API GET route ─────────────────
// Must come BEFORE the 404 catch-all so unmatched GET routes serve React,
// not a JSON 404. React then handles its own client-side routing.
app.get("/{*path}", (req, res) => {
  const indexFile = path.join(FRONTEND_DIST, "index.html");
  res.sendFile(indexFile, (err) => {
    if (err) {
      // During local dev the dist/ folder may not exist yet — graceful fallback
      res.status(200).json({
        message: "Kanban API is running. Run 'npm run build' to serve the UI.",
      });
    }
  });
});

// ─── 404 Catch-All (non-GET unmatched routes e.g. bad POST/DELETE paths) ───────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Kanban app running on http://localhost:${PORT}`);
  console.log(`   API:  http://localhost:${PORT}/tasks`);
  console.log(`   UI:   http://localhost:${PORT}/`);
});

module.exports = app;

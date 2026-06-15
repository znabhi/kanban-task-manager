/**
 * tasksApi.js
 * Centralised API service layer for the Kanban Task Manager.
 * All fetch calls go through here so the rest of the app stays decoupled from HTTP.
 */

// In development, Vite's proxy forwards /tasks → http://localhost:5000
// In production, set VITE_API_URL=https://your-backend-url
const BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Generic fetch wrapper that throws a rich Error on non-OK responses.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    // Surface the server's error message when available
    const message =
      (data && data.error) ||
      `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ─── Task Endpoints ────────────────────────────────────────────────────────────

/**
 * GET /tasks — Returns all tasks.
 * @returns {Promise<{success: boolean, data: Task[], count: number}>}
 */
export const getAllTasks = () => request("/tasks");

/**
 * POST /tasks — Creates a new task (default status: "todo").
 * @param {string} title
 * @returns {Promise<{success: boolean, data: Task}>}
 */
export const createTask = (title) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

/**
 * PUT /tasks/:id — Updates the status of a task.
 * @param {number} id
 * @param {"todo"|"done"} status
 * @returns {Promise<{success: boolean, data: Task}>}
 */
export const updateTaskStatus = (id, status) =>
  request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

/**
 * DELETE /tasks/:id — Deletes a task.
 * @param {number} id
 * @returns {Promise<{success: boolean, data: Task}>}
 */
export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: "DELETE" });

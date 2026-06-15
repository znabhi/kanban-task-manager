/**
 * useTasks.js
 * Custom React hook — encapsulates all task state, loading, and error logic.
 * Components stay pure; all side-effects live here.
 */

import { useState, useEffect, useCallback } from "react";
import {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../api/tasksApi";

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} title
 * @property {"todo"|"done"} status
 */

export function useTasks() {
  /** @type {[Task[], Function]} */
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /** Per-task loading state: { [taskId]: boolean } */
  const [taskLoading, setTaskLoading] = useState({});

  // ── Derived state ───────────────────────────────────────────────────────────
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doneTasks = tasks.filter((t) => t.status === "done");

  // ── Fetch all tasks ─────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllTasks();
      setTasks(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Set per-task loading helper ─────────────────────────────────────────────
  const setTaskBusy = (id, busy) =>
    setTaskLoading((prev) => ({ ...prev, [id]: busy }));

  // ── Add task ────────────────────────────────────────────────────────────────
  const addTask = useCallback(async (title) => {
    // Client-side guard before hitting the server
    if (!title || !title.trim()) {
      throw new Error("Title cannot be empty.");
    }
    if (title.trim().length > 200) {
      throw new Error("Title must not exceed 200 characters.");
    }

    const res = await createTask(title.trim());
    setTasks((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  // ── Move task (toggle todo ↔ done) ──────────────────────────────────────────
  const moveTask = useCallback(async (id, newStatus) => {
    setTaskBusy(id, true);
    try {
      const res = await updateTaskStatus(id, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (err) {
      throw err;
    } finally {
      setTaskBusy(id, false);
    }
  }, []);

  // ── Remove task ─────────────────────────────────────────────────────────────
  const removeTask = useCallback(async (id) => {
    setTaskBusy(id, true);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setTaskBusy(id, false);
      throw err;
    }
  }, []);

  return {
    tasks,
    todoTasks,
    doneTasks,
    loading,
    error,
    taskLoading,
    fetchTasks,
    addTask,
    moveTask,
    removeTask,
  };
}

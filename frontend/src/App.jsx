/**
 * App.jsx — Root component for the Kanban Task Manager.
 * Wires the custom hook, AddTaskForm, and two KanbanColumns together.
 */

import { useTasks } from "./hooks/useTasks";
import AddTaskForm from "./components/AddTaskForm";
import KanbanColumn from "./components/KanbanColumn";
import "./App.css";

export default function App() {
  const {
    todoTasks,
    doneTasks,
    loading,
    error,
    taskLoading,
    fetchTasks,
    addTask,
    moveTask,
    removeTask,
  } = useTasks();

  const totalTasks = todoTasks.length + doneTasks.length;

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="4" width="11" height="24" rx="3" fill="url(#g1)" />
                <rect x="16" y="4" width="14" height="15" rx="3" fill="url(#g2)" />
                <rect x="16" y="22" width="14" height="6" rx="3" fill="url(#g3)" opacity="0.7"/>
                <defs>
                  <linearGradient id="g1" x1="2" y1="4" x2="13" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8"/>
                    <stop offset="1" stopColor="#6366f1"/>
                  </linearGradient>
                  <linearGradient id="g2" x1="16" y1="4" x2="30" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399"/>
                    <stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                  <linearGradient id="g3" x1="16" y1="22" x2="30" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f472b6"/>
                    <stop offset="1" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="app-title">Kanban Board</h1>
              <p className="app-subtitle">Mini Task Manager</p>
            </div>
          </div>

          <div className="header-stats">
            <div className="stat-chip">
              <span className="stat-dot stat-dot--todo" aria-hidden="true" />
              <span>{todoTasks.length} To Do</span>
            </div>
            <div className="stat-chip">
              <span className="stat-dot stat-dot--done" aria-hidden="true" />
              <span>{doneTasks.length} Done</span>
            </div>
            {totalTasks > 0 && (
              <div className="stat-chip stat-chip--progress">
                <span>
                  {Math.round((doneTasks.length / totalTasks) * 100)}% complete
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div
            className="progress-bar-track"
            role="progressbar"
            aria-valuenow={doneTasks.length}
            aria-valuemin={0}
            aria-valuemax={totalTasks}
            aria-label={`${doneTasks.length} of ${totalTasks} tasks complete`}
          >
            <div
              className="progress-bar-fill"
              style={{ width: `${(doneTasks.length / totalTasks) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* ── Add Task Form ───────────────────────────────────────────────────── */}
      <main className="app-main">
        <section className="add-task-section" aria-label="Add new task">
          <AddTaskForm onAdd={addTask} />
        </section>

        {/* ── Global Error Banner ─────────────────────────────────────────── */}
        {error && (
          <div className="error-banner" role="alert" aria-live="polite">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4.5v4M8 10.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
            <button
              className="retry-btn"
              onClick={fetchTasks}
              aria-label="Retry loading tasks"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Loading Skeleton ─────────────────────────────────────────────── */}
        {loading ? (
          <div className="loading-state" aria-busy="true" aria-label="Loading tasks">
            <div className="kanban-board skeleton-board">
              {[0, 1].map((col) => (
                <div key={col} className="kanban-column skeleton-column">
                  <div className="skeleton-header" />
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton-card">
                      <div className="skeleton-line skeleton-line--short" />
                      <div className="skeleton-line" />
                      <div className="skeleton-line skeleton-line--medium" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="loading-text" aria-hidden="true">Loading your tasks…</p>
          </div>
        ) : (
          /* ── Kanban Board ────────────────────────────────────────────────── */
          <div className="kanban-board">
            <KanbanColumn
              title="To Do"
              tasks={todoTasks}
              taskLoading={taskLoading}
              onMove={moveTask}
              onDelete={removeTask}
              colorClass="column--todo"
              emptyMessage="No pending tasks. Add one above or move tasks back from Done."
            />

            {/* Visual divider */}
            <div className="board-divider" aria-hidden="true" />

            <KanbanColumn
              title="Done"
              tasks={doneTasks}
              taskLoading={taskLoading}
              onMove={moveTask}
              onDelete={removeTask}
              colorClass="column--done"
              emptyMessage="No completed tasks yet. Mark a task as Done to see it here."
            />
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="app-footer">
        <p>Kanban Task Manager &mdash; Built with React &amp; Express</p>
      </footer>
    </div>
  );
}

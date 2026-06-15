/**
 * TaskCard.jsx
 * Renders a single Kanban task card with move and delete actions.
 */

import { useState } from "react";

export default function TaskCard({ task, onMove, onDelete, isLoading }) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [actionError, setActionError] = useState("");

  const isTodo = task.status === "todo";
  const targetStatus = isTodo ? "done" : "todo";

  const handleMove = async () => {
    setActionError("");
    try {
      await onMove(task.id, targetStatus);
    } catch (err) {
      setActionError(err.message || "Failed to update task.");
    }
  };

  const handleDeleteClick = () => {
    // First click: show confirmation; second click: delete
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      // Auto-reset confirmation after 3 s if no action
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    handleDelete();
  };

  const handleDelete = async () => {
    setActionError("");
    try {
      await onDelete(task.id);
    } catch (err) {
      setActionError(err.message || "Failed to delete task.");
      setDeleteConfirm(false);
    }
  };

  return (
    <article
      className={`task-card ${isLoading ? "task-card--loading" : ""}`}
      data-status={task.status}
      aria-label={`Task: ${task.title}`}
    >
      {isLoading && <div className="task-card-overlay" aria-hidden="true" />}

      <div className="task-card-body">
        {/* Status badge */}
        <span className={`status-badge status-badge--${task.status}`}>
          {isTodo ? "To Do" : "Done"}
        </span>

        {/* Title */}
        <p className="task-title">{task.title}</p>

        {/* Inline action error */}
        {actionError && (
          <p className="task-error" role="alert">
            {actionError}
          </p>
        )}
      </div>

      <div className="task-card-actions">
        {/* Move button */}
        <button
          className={`btn btn-sm ${isTodo ? "btn-success" : "btn-secondary"}`}
          onClick={handleMove}
          disabled={isLoading}
          title={isTodo ? "Mark as Done" : "Move back to To Do"}
          aria-label={isTodo ? `Mark "${task.title}" as done` : `Move "${task.title}" back to To Do`}
        >
          {isTodo ? (
            <>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8.5L6.5 13 14 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Done
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              To Do
            </>
          )}
        </button>

        {/* Delete button */}
        <button
          className={`btn btn-sm ${deleteConfirm ? "btn-danger-confirm" : "btn-danger"}`}
          onClick={handleDeleteClick}
          disabled={isLoading}
          title={deleteConfirm ? "Click again to confirm delete" : "Delete task"}
          aria-label={deleteConfirm ? "Confirm delete" : `Delete task "${task.title}"`}
        >
          {deleteConfirm ? (
            <>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8.5L6.5 13 14 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Confirm
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 4h10M6 4V3h4v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Delete
            </>
          )}
        </button>
      </div>
    </article>
  );
}

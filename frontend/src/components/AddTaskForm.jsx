/**
 * AddTaskForm.jsx
 * Controlled form to create a new task.
 * Handles its own submission state and per-form error display.
 */

import { useState } from "react";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const MAX_LENGTH = 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmed = title.trim();

    // Client-side validation
    if (!trimmed) {
      setFormError("Please enter a task title.");
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setFormError(`Title must not exceed ${MAX_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle(""); // clear on success
    } catch (err) {
      setFormError(err.message || "Failed to add task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="input-wrapper">
          <input
            id="task-input"
            type="text"
            className={`task-input ${formError ? "input-error" : ""}`}
            placeholder="Enter a new task…"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (formError) setFormError(""); // clear on type
            }}
            disabled={submitting}
            maxLength={MAX_LENGTH + 1} // allow to exceed so validation fires
            aria-label="New task title"
            aria-describedby={formError ? "form-error-msg" : undefined}
            autoComplete="off"
          />
          <span className={`char-count ${title.length > MAX_LENGTH ? "over-limit" : ""}`}>
            {title.length}/{MAX_LENGTH}
          </span>
        </div>

        <button
          id="add-task-btn"
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !title.trim()}
          aria-busy={submitting}
        >
          {submitting ? (
            <span className="btn-spinner" aria-hidden="true" />
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Add Task
            </>
          )}
        </button>
      </div>

      {formError && (
        <p id="form-error-msg" className="form-error" role="alert">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {formError}
        </p>
      )}
    </form>
  );
}

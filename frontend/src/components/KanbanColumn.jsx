/**
 * KanbanColumn.jsx
 * Renders a single Kanban column (To Do or Done) with its tasks.
 */

import TaskCard from "./TaskCard";

export default function KanbanColumn({
  title,
  tasks,
  taskLoading,
  onMove,
  onDelete,
  colorClass,
  emptyMessage,
}) {
  return (
    <section className={`kanban-column ${colorClass}`} aria-label={`${title} column`}>
      {/* Column Header */}
      <header className="column-header">
        <div className="column-title-row">
          <h2 className="column-title">{title}</h2>
          <span className="task-count" aria-label={`${tasks.length} tasks`}>
            {tasks.length}
          </span>
        </div>
        <div className="column-divider" aria-hidden="true" />
      </header>

      {/* Task list */}
      <div className="column-body" role="list" aria-label={`${title} tasks`}>
        {tasks.length === 0 ? (
          <div className="empty-state" role="status">
            <div className="empty-icon" aria-hidden="true">
              {title === "To Do" ? "📋" : "✅"}
            </div>
            <p className="empty-message">{emptyMessage}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} role="listitem">
              <TaskCard
                task={task}
                onMove={onMove}
                onDelete={onDelete}
                isLoading={!!taskLoading[task.id]}
              />
            </div>
          ))
        )}
      </div>

      {/* Column footer count */}
      {tasks.length > 0 && (
        <footer className="column-footer">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </footer>
      )}
    </section>
  );
}

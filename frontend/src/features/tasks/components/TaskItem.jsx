import { Badge, Button, ProgressBar, Dropdown } from "react-bootstrap";

const TaskItem = ({
  title,
  subject,
  dueLabel,
  priority,
  priorityColor,
  status,
  statusVariant,
  rawStatus,
  progress,
  difficulty,
  onEdit,
  onComplete,
  onCycleStatus,
  onDelete,
}) => {
  const accent = priorityColor || "var(--tk-accent-blue)";
  const canComplete = rawStatus !== "completed";

  return (
    <article className="tasks-item" style={{ borderLeftColor: accent }}>
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-2">
        <div>
          <h5 className="fw-bold mb-1 tasks-item-title">{title}</h5>
          <p className="mb-0 tasks-item-course">{subject}</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Badge bg={statusVariant} pill className="px-3 py-2">
            {status}
          </Badge>
          <div
            className="px-3 py-1 tasks-priority-badge border-0"
            style={{
              backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
            }}
          >
            {priority}
          </div>
        </div>
      </div>

      <div className="tasks-item-meta mb-3">
        <span>
          <i className="bi bi-calendar-event me-1"></i>
          {dueLabel}
        </span>
        <span>
          <i className="bi bi-graph-up-arrow me-1"></i>
          Difficulty {difficulty}/5
        </span>
      </div>

      <div className="d-flex align-items-center gap-3 mb-3">
        <ProgressBar
          now={progress}
          className="tasks-item-progress flex-grow-1"
          style={{ height: "0.6rem" }}
        />
        <strong className="small">{progress}%</strong>
      </div>

      <div className="d-lg-flex gap-2 justify-content-lg-end">
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-pill px-3"
          onClick={onEdit}
        >
          <i className="bi bi-pencil-square me-1"></i>
          Edit
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          className="rounded-pill px-3"
          onClick={onCycleStatus}
        >
          <i className="bi bi-arrow-repeat me-1"></i>
          Advance Status
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          className="rounded-pill px-3"
          onClick={onDelete}
        >
          <i className="bi bi-trash3 me-1"></i>
          Delete
        </Button>
        <Button
          variant="success"
          size="sm"
          className="rounded-pill px-3"
          onClick={onComplete}
          disabled={!canComplete}
        >
          <i className="bi bi-check2 me-1"></i>
          Complete
        </Button>
      </div>
    </article>
  );
};

export default TaskItem;

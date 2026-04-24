import { Badge, Button } from "react-bootstrap";

const TaskItem = ({
  title,
  subject,
  date,
  priority,
  priorityColor,
  status,
  statusVariant,
  rawStatus,
  onComplete,
}) => {
  return (
    <div className="task-item-wrap">
      <article
        className="task-item"
        style={{
          borderLeftColor: priorityColor,
        }}
      >
        <div className="task-item-head">
          <h5 className="task-item-title mb-0">{title}</h5>
          <Badge bg={statusVariant} className="task-item-status rounded-pill">
            {status}
          </Badge>
        </div>

        <div className="task-item-meta">
          <span className="task-meta-pill">
            <i className="bi bi-journal-text"></i>
            {subject}
          </span>
          <span className="task-meta-pill">
            <i className="bi bi-calendar3"></i>
            {date}
          </span>
          <span className="task-meta-pill">
            <i className="bi bi-flag-fill" style={{ color: priorityColor }}></i>
            {priority} Priority
          </span>
        </div>

        <div className="task-item-footer">
          <div className="task-item-priority-note">
            <span
              className="task-priority-dot"
              style={{ backgroundColor: priorityColor }}
            ></span>
            <span>Priority signal</span>
          </div>

          {rawStatus !== "completed" && (
            <Button
              size="sm"
              variant="outline-success"
              className="rounded-circle task-item-action"
              aria-label={`Mark ${title} as completed`}
              onClick={onComplete}
            >
              <i className="bi bi-check2 fs-5"></i>
            </Button>
   )}
        </div>
      </article>
    </div>
  );
};

export default TaskItem;

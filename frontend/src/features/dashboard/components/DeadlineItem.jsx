import { Badge } from "react-bootstrap";

const DeadlineItem = ({ title, time, icon, badgeLabel, badgeVariant }) => {
  return (
    <div className="deadline-item p-3 rounded-4 mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="fw-bold mb-1 deadline-title">{title}</h6>
          <small className="text-muted d-inline-flex align-items-center">
            <i className={`bi bi-${icon} me-1`}></i>
            {time}
          </small>
        </div>
        <Badge bg={badgeVariant} pill className="px-3 py-2 deadline-badge">
          {badgeLabel}
        </Badge>
      </div>
    </div>
  );
};

export default DeadlineItem;

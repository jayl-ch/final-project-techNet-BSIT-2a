import { Card, ProgressBar } from "react-bootstrap";
import DeadlineItem from "./DeadlineItem";

const RightPanel = ({ deadlines = [], progress = [], loading }) => {
  return (
    <Card className="dashboard-panel border-0 rounded-4" style={{ top: "1rem" }}>
      <Card.Header className="panel-header p-4">
        <Card.Title className="fw-bold mb-0 d-flex align-items-center">
          <i className="bi bi-calendar-event me-2 text-primary"></i>Upcoming
          Deadlines
        </Card.Title>
      </Card.Header>

      <Card.Body className="p-4">
        {loading ? (
          <div className="text-secondary">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading deadlines...
          </div>
        ) : deadlines.length ? (
          deadlines.map((d, i) => <DeadlineItem key={i} {...d} />)
        ) : (
          <div className="text-secondary">No upcoming deadlines.</div>
        )}
      </Card.Body>

      <div className="panel-progress p-4">
        <h6 className="fw-bold mb-4 d-flex align-items-center">
          <i className="bi bi-graph-up me-2 text-success"></i>Tasks by Status
        </h6>
        {progress.length ? (
          progress.map((p, i) => (
            <div key={i} className="mb-4">
              <div className="d-flex justify-content-between small mb-2">
                <strong>{p.label}</strong>
                <span className={`text-${p.variant} fw-semibold`}>
                  {p.value}%
                </span>
              </div>
              <ProgressBar
                className="dashboard-progress"
                variant={p.variant}
                now={p.value}
                style={{ height: "8px" }}
              />
            </div>
          ))
        ) : (
          <div className="text-secondary small">No tasks available yet.</div>
        )}
      </div>
    </Card>
  );
};

export default RightPanel;

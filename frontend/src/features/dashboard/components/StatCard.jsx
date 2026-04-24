import { Card } from "react-bootstrap";

const StatCard = ({ icon, accent, value, label }) => {
  return (
    <Card className="stat-card border-0 h-100">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="stat-card-icon" style={{ color: accent }}>
            <i className={`bi bi-${icon}`}></i>
          </span>
        </div>

        <h3 className="stat-card-value mb-1">{value}</h3>
        <p className="stat-card-label mb-2">{label}</p>
      </Card.Body>
    </Card>
  );
};

export default StatCard;

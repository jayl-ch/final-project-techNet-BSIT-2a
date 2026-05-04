import { Card } from "react-bootstrap";

const StatCard = ({ icon, accent, value, label }) => {
  return (
    <Card className="stat-card border-0 h-100 rounded-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <p className="stat-card-label mb-2">{label}</p>
          <span className="stat-card-icon" style={{ color: accent }}>
            <i className={`bi bi-${icon}`}></i>
          </span>
        </div>

        <h3 className="stat-card-value mb-1">{value}</h3>
      </Card.Body>
    </Card>
  );
};

export default StatCard;

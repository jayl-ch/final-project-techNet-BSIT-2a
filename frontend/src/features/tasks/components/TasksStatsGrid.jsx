import { Card, Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const TasksStatsGrid = ({ stats, motionVariants }) => {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <Row className="g-3 g-xl-4 mb-4 mb-xl-5">
      {safeStats.map((item) => (
        <Col key={item.id} xl={3} lg={6} md={6} sm={12}>
          <MotionDiv variants={motionVariants}>
            <Card className="tasks-stat-card border-0 rounded-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="tasks-stat-label">{item.label}</span>
                  <span
                    className="tasks-stat-icon"
                    style={{ color: item.accent }}
                    aria-hidden="true"
                  >
                    <i className={`bi bi-${item.icon}`}></i>
                  </span>
                </div>
                <div className="tasks-stat-value">{item.value}</div>
              </Card.Body>
            </Card>
          </MotionDiv>
        </Col>
      ))}
    </Row>
  );
};

export default TasksStatsGrid;

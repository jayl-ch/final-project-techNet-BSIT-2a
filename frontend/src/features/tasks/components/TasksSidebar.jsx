import { Badge, Card, Col, ProgressBar } from "react-bootstrap";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const TasksSidebar = ({ completion, stats, upcomingMilestones, motionVariants }) => {
  const overdueCount =
    stats?.find((item) => item.id === "overdue")?.value || 0;
  const milestones = Array.isArray(upcomingMilestones)
    ? upcomingMilestones
    : [];

  return (
    <Col xl={4}>
      <MotionDiv variants={motionVariants}>
        <Card className="tasks-side-card border-0 rounded-4 mb-4">
          <Card.Header className="tasks-side-head border-0 p-4 pb-2">
            <Card.Title className="fw-bold mb-1">Daily Velocity</Card.Title>
            <p className="small text-secondary mb-0">
              Stay above 80% completion for your current sprint.
            </p>
          </Card.Header>
          <Card.Body className="p-4 pt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-secondary">Completion Score</span>
              <span className="fw-bold">{completion}%</span>
            </div>
            <ProgressBar
              now={completion}
              className="tasks-progress"
              style={{ height: "0.65rem" }}
            />
            <div className="tasks-focus-chip mt-4">
              <i className="bi bi-stars"></i>
              {overdueCount} tasks need urgent focus
            </div>
          </Card.Body>
        </Card>
      </MotionDiv>

      <MotionDiv variants={motionVariants}>
        <Card className="tasks-side-card border-0 rounded-4">
          <Card.Header className="tasks-side-head border-0 p-4 pb-2 d-flex justify-content-between align-items-center">
            <Card.Title className="fw-bold mb-0">Upcoming Milestones</Card.Title>
            <Badge bg="secondary" pill>
              {milestones.length}
            </Badge>
          </Card.Header>
          <Card.Body className="p-4 pt-2">
            {milestones.length === 0 ? (
              <p className="small text-secondary mb-0">
                No upcoming active tasks.
              </p>
            ) : (
              milestones.map((item) => (
                <div key={item.id} className="tasks-milestone-item">
                  <div>
                    <p className="fw-semibold mb-1 tasks-milestone-title">
                      {item.title}
                    </p>
                    <p className="small text-secondary mb-0">
                      <i className="bi bi-calendar3 me-1"></i>
                      {item.due}
                    </p>
                  </div>
                  <Badge bg={item.variant} className="rounded-pill px-3 py-2">
                    {item.type}
                  </Badge>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </MotionDiv>
    </Col>
  );
};

export default TasksSidebar;

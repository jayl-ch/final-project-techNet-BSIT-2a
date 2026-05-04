import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

const MotionSection = motion.section;

const TasksHero = ({ dateLabel, onCreate, motionVariants }) => {
  return (
    <MotionSection className="tasks-hero mb-4 mb-xl-5" variants={motionVariants}>
      <div>
        <p className="tasks-hero-date mb-2">{dateLabel}</p>
        <h1 className="tasks-hero-title mb-2">Task Studio</h1>
        <p className="tasks-hero-subtitle mb-0">
          Organize deadlines, focus on urgent work, and keep your day moving
          with clarity.
        </p>
      </div>
      <div className="d-flex flex-wrap gap-2">
        <Button
          variant="light"
          className="rounded-pill px-4 fw-semibold"
          onClick={onCreate}
        >
          <i className="bi bi-plus-lg me-2"></i>
          New Task
        </Button>
      </div>
    </MotionSection>
  );
};

export default TasksHero;

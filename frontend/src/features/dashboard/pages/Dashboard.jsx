import { useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import TaskList from "../components/TaskList";
import RightPanel from "../components/RightPanel";
import { useDashboardData } from "../hooks/useDashboardData";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const shellVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Dashboard = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const handleUnauthorized = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const {
    student,
    taskItems,
    stats,
    deadlines,
    progress,
    loading,
    error,
    completeTask,
  } = useDashboardData(handleUnauthorized);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <MotionDiv
      className="dashboard dashboard-shell"
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      <MotionSection
        className="dashboard-hero mb-4 mb-xl-5"
        variants={prefersReducedMotion ? undefined : itemVariants}
      >
        <div>
          <p className="dashboard-date mb-2">{today}</p>
          <h1 className="dashboard-title mb-2">
            Welcome back, {student?.name || "Student"}
          </h1>
          <p className="dashboard-subtitle mb-0">
            Focus on high-priority tasks and keep your weekly progress on track.
          </p>
        </div>
      </MotionSection>

      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <Row className="g-3 g-xl-4 mb-4 mb-xl-5">
          {stats.map((stat) => (
            <Col key={stat.id} xl={3} lg={6} md={6} sm={12}>
              <StatCard {...stat} />
            </Col>
          ))}
        </Row>
      </MotionDiv>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Row className="g-4 align-items-start">
        <Col xl={8}>
          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <TaskList
              tasks={taskItems}
              loading={loading}
              error={error}
              onCompleteTask={completeTask}
            />
          </MotionDiv>
        </Col>
        <Col xl={4}>
          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <RightPanel
              deadlines={deadlines}
              progress={progress}
              loading={loading}
            />
          </MotionDiv>
        </Col>
      </Row>
    </MotionDiv>
  );
};

export default Dashboard;

import { Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const GroupsAlerts = ({
  error,
  loading,
  actionError,
  onDismissActionError,
  prefersReducedMotion,
  itemVariants,
}) => (
  <>
    {error && !loading && (
      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <Alert
          variant="danger"
          dismissible
          onClose={() => {}}
          className="mb-4"
        >
          {error}
        </Alert>
      </MotionDiv>
    )}
    {actionError && (
      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <Alert
          variant="danger"
          dismissible
          onClose={() => onDismissActionError?.()}
          className="mb-4"
        >
          {actionError}
        </Alert>
      </MotionDiv>
    )}
  </>
);

export default GroupsAlerts;

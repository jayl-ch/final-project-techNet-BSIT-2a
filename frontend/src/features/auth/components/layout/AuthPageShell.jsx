import { Container } from "react-bootstrap";
import { motion, useReducedMotion } from "framer-motion";
import AuthCard from "./AuthCard";

const MotionMain = motion.main;

const shellVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const AuthPageShell = ({ children, cardName, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionMain
      className={`min-vh-100 d-flex justify-content-center align-items-center ${className}`.trim()}
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      <Container fluid="sm" style={{ maxWidth: "45rem" }}>
        <div className="row justify-content-center">
          <div className="col-12">
            <AuthCard name={cardName}>{children}</AuthCard>
          </div>
        </div>
      </Container>
    </MotionMain>
  );
};

export default AuthPageShell;

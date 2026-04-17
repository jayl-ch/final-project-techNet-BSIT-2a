import { motion } from "framer-motion";
import { Container, Button } from "react-bootstrap";

import {
  containerVariants,
  fadeUp,
  buttonVariants,
} from "../constants/transition";

const CTASection = () => {
  return (
    <section className="bg-primary text-white py-5 py-lg-6 position-relative overflow-hidden">
      {/* subtle animated background glow */}
      <motion.div
        className="position-absolute top-50 start-50 translate-middle"
        style={{
          width: "600px",
          height: "600px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        fluid="lg"
        className="text-center position-relative"
        style={{ zIndex: 1 }}
      >
        <motion.h2 variants={fadeUp} className="display-6 fw-bold mb-4">
          Ready to Get Organized?
        </motion.h2>

        <motion.p variants={fadeUp} className="lead fs-5 mb-5 opacity-90">
          Start managing your tasks today and boost your productivity.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="d-flex flex-column flex-sm-row gap-3 justify-content-center"
        >
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button variant="light" size="lg" className="px-5 fw-600">
              <i className="bi bi-play-fill me-2"></i>Start Now
            </Button>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button variant="outline-light" size="lg" className="px-5 fw-600">
              <i className="bi bi-file-earmark-plus me-2"></i>Create Free
              Account
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTASection;

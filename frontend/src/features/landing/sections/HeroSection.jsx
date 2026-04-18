import { Container, Button } from "react-bootstrap";
import { Link } from "react-router";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, // smoother easing
  },
};

const buttonVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const buttonHover = {
  scale: 1.06,
  y: -4,
  transition: { type: "spring", stiffness: 320, damping: 18 },
};

const HeroSection = () => {
  return (
    <section className="hero-section d-flex align-items-center text-white position-relative overflow-hidden">
      {/* 🔥 ambient animated background */}
      <motion.div
        className="position-absolute top-50 start-50 translate-middle"
        style={{
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)",
          filter: "blur(120px)",
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container
        as={motion.div}
        variants={container}
        initial="hidden"
        animate="show" // ✅ on load
        className="position-relative"
        style={{ zIndex: 1 }}
      >
        <motion.div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 text-center">
            {/* headline */}
            <motion.h1 variants={fadeUp} className="display-3 fw-bold mb-4">
              Manage Your Tasks <span className="text-warning">Smarter</span>
            </motion.h1>

            {/* subtext */}
            <motion.p variants={fadeUp} className="lead fs-5 mb-5 opacity-90">
              Organize assignments, track deadlines, and boost productivity with
              intelligent task management designed for students.
            </motion.p>
          </div>

          {/* buttons */}
          <motion.div
            className="d-flex flex-column flex-sm-row gap-3 align-items-center justify-content-center"
            variants={container}
          >
            <motion.div
              variants={buttonVariant}
              whileHover={buttonHover}
              whileTap={{ scale: 0.94 }}
            >
              <Button
                as={Link}
                to="/login"
                size="lg"
                variant="light"
                className="px-5 py-3 fw-600 shadow"
              >
                <motion.i
                  className="bi bi-box-arrow-in-right me-2"
                  whileHover={{ x: 4 }}
                />
                Get Started
              </Button>
            </motion.div>

            <motion.div
              variants={buttonVariant}
              whileHover={buttonHover}
              whileTap={{ scale: 0.94 }}
            >
              <Button
                as={Link}
                to="/register"
                size="lg"
                variant="outline-light"
                className="px-5 py-3 fw-600"
              >
                <motion.i
                  className="bi bi-person-plus me-2"
                  whileHover={{ scale: 1.2 }}
                />
                Create Account
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default HeroSection;

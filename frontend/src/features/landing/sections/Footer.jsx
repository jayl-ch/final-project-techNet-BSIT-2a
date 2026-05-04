import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Footer = () => {
  return (
    <footer className="bg-dark text-white-50 py-5 position-relative overflow-hidden">
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <Container
        as={motion.div}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        fluid="lg"
      >
        <div className="row g-4 align-items-center">
          <motion.div className="col-md-4" variants={fadeUp}>
            <h5 className="text-white fw-bold mb-3">TaskWise</h5>
            <p className="small mb-0">
              Helping students organize, prioritize, and manage their academic
              workload effectively.
            </p>
          </motion.div>

          <motion.div className="col-md-4 text-md-center" variants={fadeUp}>
            <div className="d-flex justify-content-center gap-3">
              <motion.a
                href="https://www.github.com/jayl-ch/final-project-techNet-BSIT-2a"
                whileHover={{ y: -3, scale: 1.2, color: "#fff" }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ cursor: "pointer" }}
                className="text-decoration-none"
              >
                <motion.i className={`bi bi-github fs-5`} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div className="col-md-4 text-md-end" variants={fadeUp}>
            <p className="small mb-1">&copy; 2026 TaskWise</p>
            <p className="small mb-0 opacity-75">All rights reserved.</p>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

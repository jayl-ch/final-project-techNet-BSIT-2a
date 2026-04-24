import { motion } from "framer-motion";
import { Card, Container } from "react-bootstrap";

const MotionDiv = motion.div;
const MotionH2 = motion.h2;
const MotionP = motion.p;

const feats = [
  {
    title: "Task Management",
    desc: "Create, edit, delete, and organize all your academic assignments in one place.",
    icon: "bi-list-check text-primary",
  },
  {
    title: "Smart Priority",
    desc: "Automatic priority assignment based on deadlines and task importance.",
    icon: "bi-star-fill text-warning",
  },
  {
    title: "Deadline Analytics",
    desc: "Visual tracking of upcoming, overdue, and completed tasks.",
    icon: "bi-graph-up text-success",
  },
  {
    title: "Progress Tracking",
    desc: "Monitor completion rates and task history with detailed insights.",
    icon: "bi-check-circle text-info",
  },
  {
    title: "Group Collaboration",
    desc: "Shared tasks for group projects.",
    icon: "bi-people text-info",
  },
];

const duplicateSlides = [...feats, ...feats];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Features = () => {
  return (
    <div className="overflow-hidden w-100 py-4">
      <MotionDiv
        animate={{
          x: [0, -1620],
        }}
        transition={{
          ease: "linear",
          duration: 15,
          repeat: Infinity,
        }}
        className="d-flex gap-4 w-max"
      >
        {duplicateSlides.map(({ title, desc, icon }, i) => (
          <MotionDiv
            key={i}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card
              className="border-0 bg-light shadow-sm h-100"
              style={{ width: "300px" }}
            >
              <Card.Body className="text-center p-4">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ height: "80px", width: "80px" }}
                >
                  <i className={`bi fs-1 ${icon}`}></i>
                </div>

                <Card.Title className="fw-bold text-dark mb-3">
                  {title}
                </Card.Title>

                <Card.Text className="text-dark">{desc}</Card.Text>
              </Card.Body>
            </Card>
          </MotionDiv>
        ))}
      </MotionDiv>
    </div>
  );
};

const FeatureSection = () => {
  return (
    <section className="py-5 py-lg-6 bg-light">
      <Container id="features" fluid="lg">
        <MotionDiv
          className="row justify-content-center mb-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={container}
        >
          <div className="col-lg-10 col-md-12 text-center">
            <MotionH2
              className="text-dark display-5 fw-bold mb-3"
              variants={fadeUp}
            >
              Everything You Need
            </MotionH2>

            <MotionP className="lead text-dark fs-5" variants={fadeUp}>
              Powerful features designed for students
            </MotionP>
          </div>
        </MotionDiv>

        <Features />
      </Container>
    </section>
  );
};

export default FeatureSection;

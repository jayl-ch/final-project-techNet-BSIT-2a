import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import TaskWiseIcon from "../../../shared/ui/icon/TaskWiseIcon";

const NAV_LINKS = ["Features", "Pricing"];

const NavBar = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const close = () => setExpanded(false);

  return (
    <motion.div
      className={`landing-nav fixed-top ${scrolled || expanded ? "bg-primary bg-opacity-75 shadow" : ""}`}
      style={{ backdropFilter: scrolled || expanded ? "blur(10px)" : "none" }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Navbar
        variant="dark"
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        className="py-0 landing-navbar"
      >
        <Container fluid="lg">
          {/* BRAND */}
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={close}
            className="d-flex align-items-center gap-2 fw-bold py-3"
          >
            <TaskWiseIcon bg="transparent" />
            TaskWise
          </Navbar.Brand>

          {/* MOBILE: CTA + Toggler */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            <Nav.Link
              as={Link}
              to="/register"
              onClick={close}
              className="btn btn-primary btn-sm fw-semibold px-3"
            >
              Get started
            </Nav.Link>
            <Navbar.Toggle
              aria-controls="main-nav"
              className="border-0 shadow-none"
            />
          </div>

          {/* NAV LINKS */}
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto align-items-lg-center gap-1 pb-3 pb-lg-0">
              {NAV_LINKS.map((label) => (
                <Nav.Link
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  onClick={close}
                  className="fw-medium"
                >
                  {label}
                </Nav.Link>
              ))}

              <hr className="d-lg-none text-secondary my-1" />

              <Nav.Link
                as={Link}
                to="/login"
                onClick={close}
                className="fw-medium"
              >
                Login
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/register"
                onClick={close}
                className="d-none d-lg-inline-flex align-items-center justify-content-center fw-semibold px-4 rounded-pill signup-btn"
              >
                Sign Up
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default NavBar;

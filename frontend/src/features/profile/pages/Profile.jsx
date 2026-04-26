import { useCallback } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  ProgressBar,
  Row,
  Spinner,
} from "react-bootstrap";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "../hooks/useProfileData";

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

const Profile = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const {
    profile,
    formValues,
    loading,
    saving,
    error,
    saveError,
    successMessage,
    completion,
    updateField,
    resetForm,
    saveProfile,
  } = useProfileData(handleUnauthorized);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveProfile();
  };

  return (
    <MotionDiv
      className="profile profile-shell"
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      <MotionSection
        className="profile-hero mb-4 mb-xl-5"
        variants={prefersReducedMotion ? undefined : itemVariants}
      >
        <div>
          <p className="profile-date mb-2">{today}</p>
          <h1 className="profile-title mb-2">Profile Settings</h1>
          <p className="profile-subtitle mb-0">
            Manage your account details and update your password securely.
          </p>
        </div>
        <Badge bg="light" text="dark" pill className="px-3 py-2 fw-semibold">
          {completion}% complete
        </Badge>
      </MotionSection>

      {error && (
        <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        </MotionDiv>
      )}

      <Row className="g-4 align-items-start">
        <Col xl={4}>
          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <Card className="profile-card border-0 rounded-4">
              <Card.Body className="p-4">
                <div className="profile-avatar mb-3" aria-hidden="true">
                  {(profile?.name || "S").charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-bold mb-1">{profile?.name || "Student"}</h5>
                <p className="text-secondary mb-3">{profile?.email || "No email"}</p>

                <div className="mb-2 d-flex justify-content-between small">
                  <span>Profile Completion</span>
                  <span className="fw-semibold">{completion}%</span>
                </div>
                <ProgressBar now={completion} className="profile-progress mb-4" />

                <ul className="profile-security-list list-unstyled mb-0">
                  <li>
                    <i className="bi bi-shield-lock me-2" />
                    Use a strong password with at least 6 characters.
                  </li>
                  <li>
                    <i className="bi bi-envelope-check me-2" />
                    Keep your email accurate for account recovery.
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </MotionDiv>
        </Col>

        <Col xl={8}>
          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <Card className="profile-card border-0 rounded-4">
              <Card.Header className="profile-card-header px-4 py-3">
                <Card.Title className="fw-bold mb-1">Edit Profile</Card.Title>
                <p className="small text-secondary mb-0">
                  Update your name, email, and optionally change your password.
                </p>
              </Card.Header>
              <Card.Body className="p-4">
                {loading ? (
                  <div className="text-center py-5 text-secondary">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading profile...
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    {saveError && (
                      <Alert variant="danger" className="mb-3">
                        {saveError}
                      </Alert>
                    )}

                    {successMessage && (
                      <Alert variant="success" className="mb-3">
                        {successMessage}
                      </Alert>
                    )}

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={formValues.name}
                          onChange={updateField}
                          maxLength={50}
                          required
                          placeholder="Enter your full name"
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          value={formValues.email}
                          onChange={updateField}
                          maxLength={255}
                          required
                          placeholder="Enter your email"
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          name="currentPassword"
                          type="password"
                          value={formValues.currentPassword}
                          onChange={updateField}
                          placeholder="Required only for password change"
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          name="newPassword"
                          type="password"
                          value={formValues.newPassword}
                          onChange={updateField}
                          placeholder="Leave blank to keep current password"
                        />
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <Button type="submit" disabled={saving} className="rounded-pill px-4">
                        {saving ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2-circle me-2" />
                            Save Changes
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline-secondary"
                        className="rounded-pill px-4"
                        onClick={resetForm}
                        disabled={saving}
                      >
                        Reset
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </MotionDiv>
        </Col>
      </Row>
    </MotionDiv>
  );
};

export default Profile;

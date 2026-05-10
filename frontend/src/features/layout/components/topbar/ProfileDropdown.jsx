import { Nav, Dropdown, Modal, Button } from "react-bootstrap";

const ProfileDropdown = ({
  studentName,
  studentEmail,
  showProfileModal,
  showSupportModal,
  supportEmail,
  onGoToProfile,
  onOpenProfile,
  onCloseProfile,
  onOpenSupport,
  onCloseSupport,
  onSupport,
  onSignOut,
}) => {
  return (
    <>
      <Nav.Link>
        <Dropdown>
          <Dropdown.Toggle
            id="topbar-profile-dropdown"
            style={{ color: "var(--bs-body-color)" }}
            variant="link"
            className="d-flex align-items-center gap-3 text-decoration-none"
          >
            <i className="bi bi-person-circle fs-4"></i>
            {studentName}
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={onGoToProfile}>Profile Settings</Dropdown.Item>
            <Dropdown.Item onClick={onOpenProfile}>Account Details</Dropdown.Item>
            <Dropdown.Item onClick={onOpenSupport}>Contact Support</Dropdown.Item>
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item onClick={onSignOut}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav.Link>

      <Modal centered show={showProfileModal} onHide={onCloseProfile}>
        <Modal.Header closeButton>
          <Modal.Title>Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <strong>Name:</strong> {studentName}
          </div>
          <div>
            <strong>Email:</strong> {studentEmail || "Not available"}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCloseProfile}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered show={showSupportModal} onHide={onCloseSupport}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Support</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Need help with tasks, groups, or your account? Email us at:
          </p>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-envelope"></i>
            <strong>{supportEmail}</strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCloseSupport}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onSupport();
              onCloseSupport();
            }}
          >
            Email Support
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileDropdown;

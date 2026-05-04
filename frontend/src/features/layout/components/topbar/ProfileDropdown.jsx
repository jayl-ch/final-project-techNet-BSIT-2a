import { Nav, Dropdown, Modal, Button } from "react-bootstrap";

const ProfileDropdown = ({
  theme,
  studentName,
  studentEmail,
  showProfileModal,
  onOpenProfile,
  onCloseProfile,
  onToggleTheme,
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
            <Dropdown.Item onClick={onOpenProfile}>Edit Profile</Dropdown.Item>
            <Dropdown.Item onClick={onToggleTheme}>
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </Dropdown.Item>
            <Dropdown.Item onClick={onSupport}>Support</Dropdown.Item>
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
    </>
  );
};

export default ProfileDropdown;

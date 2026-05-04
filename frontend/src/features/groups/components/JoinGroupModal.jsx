import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

const JoinGroupModal = ({
  show,
  onClose,
  onSubmit,
  form,
  onChange,
  loading,
  error,
  onDismissError,
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Form onSubmit={onSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-plus me-2" />
          Join Group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => onDismissError?.()}
          >
            {error}
          </Alert>
        )}

        <Form.Group controlId="join-group-code">
          <Form.Label className="fw-semibold small">Invite Code</Form.Label>
          <Form.Control
            name="code"
            required
            value={form.code}
            onChange={onChange}
            placeholder="Paste your invite code here"
            autoFocus
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Joining...
            </>
          ) : (
            <>
              <i className="bi bi-person-plus me-1" />
              Join
            </>
          )}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default JoinGroupModal;

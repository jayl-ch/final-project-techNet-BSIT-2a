import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

const CreateGroupModal = ({
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
          <i className="bi bi-people me-2" />
          Create Group
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

        <Form.Group className="mb-3" controlId="group-name">
          <Form.Label className="fw-semibold small">Group Name</Form.Label>
          <Form.Control
            name="name"
            maxLength={20}
            required
            value={form.name}
            onChange={onChange}
            placeholder="e.g. Study Squad 42"
            autoFocus
          />
          <Form.Text className="text-secondary">
            {form.name.length}/20 characters
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="group-invite-code">
          <Form.Label className="fw-semibold small">
            Invite Code <span className="text-secondary fw-normal">(optional)</span>
          </Form.Label>
          <Form.Control
            name="inviteCode"
            value={form.inviteCode}
            onChange={onChange}
            placeholder="Leave empty to auto-generate"
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
              Creating...
            </>
          ) : (
            <>
              <i className="bi bi-plus-lg me-1" />
              Create
            </>
          )}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default CreateGroupModal;

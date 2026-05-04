import { Alert, Button, Modal, Spinner } from "react-bootstrap";

const ConfirmActionModal = ({
  show,
  title,
  message,
  confirmLabel = "Confirm",
  loadingLabel = "Working...",
  confirmVariant = "danger",
  loading = false,
  error,
  onConfirm,
  onCancel,
  onDismissError,
}) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>
        <i className="bi bi-exclamation-triangle me-2" />
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {error && (
        <Alert variant="danger" dismissible onClose={() => onDismissError?.()}>
          {error}
        </Alert>
      )}
      <p className="mb-0 text-secondary">{message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" />
            {loadingLabel}
          </>
        ) : (
          confirmLabel
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmActionModal;

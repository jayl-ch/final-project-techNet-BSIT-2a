import { Alert, Button, Form, Modal, Spinner, InputGroup } from "react-bootstrap";

const TaskFormModal = ({
  show,
  title,
  submitLabel,
  loadingLabel,
  onClose,
  onSubmit,
  values,
  onChange,
  saving,
  error,
  idPrefix = "task",
}) => {
  const displayValues = values || {};
  const busyLabel = loadingLabel || submitLabel;
  const difficultyValue = displayValues.difficulty ?? 3;
  const statusValue = displayValues.status || "pending";

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId={`${idPrefix}-name`}>
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              name="name"
              maxLength={20}
              required
              value={displayValues.name || ""}
              onChange={onChange}
              placeholder="Task title"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId={`${idPrefix}-subject`}>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              name="subject"
              maxLength={20}
              value={displayValues.subject || ""}
              onChange={onChange}
              placeholder="Subject or category"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId={`${idPrefix}-difficulty`}>
            <Form.Label>Difficulty (1 to 5)</Form.Label>
            <Form.Select
              name="difficulty"
              value={difficultyValue}
              onChange={onChange}
              style={{ color: "yellow" }}
            >
              {["★", "★★", "★★★", "★★★★", "★★★★★"].map((item, i) => (
                <option key={i} value={i+1}>{item}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId={`${idPrefix}-deadline`}>
            <Form.Label>Deadline</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-calendar-event" aria-hidden="true" />
              </InputGroup.Text>
              <Form.Control
                type="datetime-local"
                name="deadline"
                required
                value={displayValues.deadline || ""}
                onChange={onChange}
                step={900}
                aria-label="Deadline date and time"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId={`${idPrefix}-status`}>
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={statusValue} onChange={onChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                {busyLabel}
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;

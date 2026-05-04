import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";

const AssignTaskForm = ({
  assignForm,
  assignableTasks = [],
  assignableMembers = [],
  loading,
  error,
  onChange,
  onSubmit,
  onDismissError,
}) => (
  <Card className="border-0 rounded-4 mb-4 group-assignment-box">
    <Card.Body className="p-3 p-xl-4">
      <h6 className="fw-bold mb-1">
        <i className="bi bi-send me-2" />
        Assign Task to Member
      </h6>
      <p className="small text-secondary mb-3">
        Select a task and a member to assign it to.
      </p>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => onDismissError?.()}
          className="mb-3"
        >
          {error}
        </Alert>
      )}

      <Form onSubmit={onSubmit} className="row g-2 align-items-end">
        <div className="col-md-5">
          <Form.Label className="small fw-semibold">Task</Form.Label>
          <Form.Select
            name="taskId"
            value={assignForm.taskId}
            onChange={onChange}
            required
          >
            <option value="">Select a task...</option>
            {assignableTasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.name || "Untitled Task"}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-5">
          <Form.Label className="small fw-semibold">Member</Form.Label>
          <Form.Select
            name="assignedTo"
            value={assignForm.assignedTo}
            onChange={onChange}
            required
          >
            <option value="">Select a member...</option>
            {assignableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-2 d-grid">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-1" />
                Assigning...
              </>
            ) : (
              <>
                <i className="bi bi-send me-1" />
                Assign
              </>
            )}
          </Button>
        </div>
      </Form>
    </Card.Body>
  </Card>
);

export default AssignTaskForm;

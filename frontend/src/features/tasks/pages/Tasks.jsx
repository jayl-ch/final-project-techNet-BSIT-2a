import { useCallback, useState } from "react";
import {
  Row,
  Col,
  Card,
  ProgressBar,
  Badge,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import { useTasksData } from "../hooks/useTasksData";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const initialForm = {
  name: "",
  subject: "",
  difficulty: 3,
  deadline: "",
  status: "pending",
};

const toDateTimeLocalValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const shellVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.28,
      when: "beforeChildren",
      staggerChildren: 0.07,
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

const Tasks = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const handleUnauthorized = useCallback(() => {
    navigate("/login");
  }, [navigate]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formValues, setFormValues] = useState(initialForm);
  const [editValues, setEditValues] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editError, setEditError] = useState("");

  const {
    loading,
    error,
    stats,
    completion,
    upcomingMilestones,
    visibleTasks,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    completeTask,
    cycleTaskStatus,
    removeTask,
    addTask,
    editTask,
  } = useTasksData(handleUnauthorized);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleOpenCreate = () => {
    setShowCreateModal(true);
    setSaveError("");
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setFormValues(initialForm);
    setSaveError("");
  };

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "difficulty" ? Number(value) : value,
    }));
  };

  const handleChangeEditForm = (event) => {
    const { name, value } = event.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: name === "difficulty" ? Number(value) : value,
    }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      await addTask(formValues);
      handleCloseCreate();
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Failed to create task.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTaskId(task.id);
    setEditValues({
      name: task.title || "",
      subject: task.subject || "",
      difficulty: Number(task.difficulty) || 3,
      deadline: toDateTimeLocalValue(task.deadlineISO),
      status: task.rawStatus || "pending",
    });
    setEditError("");
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingTaskId(null);
    setEditValues(initialForm);
    setEditError("");
  };

  const handleEditTask = async (event) => {
    event.preventDefault();

    if (!editingTaskId) {
      return;
    }

    setEditSaving(true);
    setEditError("");

    try {
      await editTask(editingTaskId, editValues);
      handleCloseEdit();
    } catch (err) {
      setEditError(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <MotionDiv
      className="tasks tasks-shell"
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      <MotionSection
        className="tasks-hero mb-4 mb-xl-5"
        variants={prefersReducedMotion ? undefined : itemVariants}
      >
        <div>
          <p className="tasks-hero-date mb-2">{today}</p>
          <h1 className="tasks-hero-title mb-2">Task Studio</h1>
          <p className="tasks-hero-subtitle mb-0">
            Organize deadlines, focus on urgent work, and keep your day moving
            with clarity.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Button
            variant="light"
            className="rounded-pill px-4 fw-semibold"
            onClick={handleOpenCreate}
          >
            <i className="bi bi-plus-lg me-2"></i>
            New Task
          </Button>
        </div>
      </MotionSection>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row className="g-3 g-xl-4 mb-4 mb-xl-5">
        {stats.map((item) => (
          <Col key={item.id} xl={3} lg={6} md={6} sm={12}>
            <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
              <Card className="tasks-stat-card border-0 rounded-4">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="tasks-stat-label">{item.label}</span>
                    <span
                      className="tasks-stat-icon"
                      style={{ color: item.accent }}
                      aria-hidden="true"
                    >
                      <i className={`bi bi-${item.icon}`}></i>
                    </span>
                  </div>
                  <div className="tasks-stat-value">{item.value}</div>
                </Card.Body>
              </Card>
            </MotionDiv>
          </Col>
        ))}
      </Row>

      <Row className="g-4 align-items-start">
        <Col xl={8}>
          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <TaskList
              loading={loading}
              tasks={visibleTasks}
              query={query}
              onQueryChange={setQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onEdit={handleOpenEdit}
              onComplete={completeTask}
              onCycleStatus={cycleTaskStatus}
              onDelete={removeTask}
            />
          </MotionDiv>
        </Col>

        <Col xl={4}>
          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <Card className="tasks-side-card border-0 rounded-4 mb-4">
              <Card.Header className="tasks-side-head border-0 p-4 pb-2">
                <Card.Title className="fw-bold mb-1">Daily Velocity</Card.Title>
                <p className="small text-secondary mb-0">
                  Stay above 80% completion for your current sprint.
                </p>
              </Card.Header>
              <Card.Body className="p-4 pt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-secondary">Completion Score</span>
                  <span className="fw-bold">{completion}%</span>
                </div>
                <ProgressBar
                  now={completion}
                  className="tasks-progress"
                  style={{ height: "0.65rem" }}
                />
                <div className="tasks-focus-chip mt-4">
                  <i className="bi bi-stars"></i>
                  {stats.find((item) => item.id === "overdue")?.value || 0} tasks need
                  urgent focus
                </div>
              </Card.Body>
            </Card>
          </MotionDiv>

          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <Card className="tasks-side-card border-0 rounded-4">
              <Card.Header className="tasks-side-head border-0 p-4 pb-2 d-flex justify-content-between align-items-center">
                <Card.Title className="fw-bold mb-0">Upcoming Milestones</Card.Title>
                <Badge bg="secondary" pill>
                  {upcomingMilestones.length}
                </Badge>
              </Card.Header>
              <Card.Body className="p-4 pt-2">
                {upcomingMilestones.length === 0 ? (
                  <p className="small text-secondary mb-0">No upcoming active tasks.</p>
                ) : (
                  upcomingMilestones.map((item) => (
                    <div key={item.id} className="tasks-milestone-item">
                      <div>
                        <p className="fw-semibold mb-1 tasks-milestone-title">{item.title}</p>
                        <p className="small text-secondary mb-0">
                          <i className="bi bi-calendar3 me-1"></i>
                          {item.due}
                        </p>
                      </div>
                      <Badge bg={item.variant} className="rounded-pill px-3 py-2">
                        {item.type}
                      </Badge>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </MotionDiv>
        </Col>
      </Row>

      <Modal show={showCreateModal} onHide={handleCloseCreate} centered>
        <Form onSubmit={handleCreateTask}>
          <Modal.Header closeButton>
            <Modal.Title>Create Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {saveError && <Alert variant="danger">{saveError}</Alert>}

            <Form.Group className="mb-3" controlId="task-name">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                name="name"
                maxLength={20}
                required
                value={formValues.name}
                onChange={handleChangeForm}
                placeholder="Task title"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="task-subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                name="subject"
                maxLength={20}
                value={formValues.subject}
                onChange={handleChangeForm}
                placeholder="Subject or category"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="task-difficulty">
              <Form.Label>Difficulty (1 to 5)</Form.Label>
              <Form.Select
                name="difficulty"
                value={formValues.difficulty}
                onChange={handleChangeForm}
              >
                <option value={1}>1 - Easiest</option>
                <option value={2}>2</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4</option>
                <option value={5}>5 - Hardest</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="task-deadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                name="deadline"
                required
                value={formValues.deadline}
                onChange={handleChangeForm}
              />
            </Form.Group>

            <Form.Group controlId="task-status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formValues.status}
                onChange={handleChangeForm}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseCreate}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEdit} centered>
        <Form onSubmit={handleEditTask}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}

            <Form.Group className="mb-3" controlId="task-edit-name">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                name="name"
                maxLength={20}
                required
                value={editValues.name}
                onChange={handleChangeEditForm}
                placeholder="Task title"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="task-edit-subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                name="subject"
                maxLength={20}
                value={editValues.subject}
                onChange={handleChangeEditForm}
                placeholder="Subject or category"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="task-edit-difficulty">
              <Form.Label>Difficulty (1 to 5)</Form.Label>
              <Form.Select
                name="difficulty"
                value={editValues.difficulty}
                onChange={handleChangeEditForm}
              >
                <option value={1}>1 - Easiest</option>
                <option value={2}>2</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4</option>
                <option value={5}>5 - Hardest</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="task-edit-deadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                name="deadline"
                required
                value={editValues.deadline}
                onChange={handleChangeEditForm}
              />
            </Form.Group>

            <Form.Group controlId="task-edit-status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={editValues.status}
                onChange={handleChangeEditForm}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={editSaving}>
              {editSaving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MotionDiv>
  );
};

export default Tasks;

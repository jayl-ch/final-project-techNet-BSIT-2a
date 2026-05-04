import { Card, Form, InputGroup, Badge, Spinner } from "react-bootstrap";
import TaskItem from "./TaskItem";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const TaskList = ({
  loading,
  tasks,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onEdit,
  onComplete,
  onCycleStatus,
  onDelete,
}) => {

  return (
    <Card className="tasks-list-card border-0 rounded-4">
      <Card.Header className="tasks-list-header px-4 py-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <Card.Title className="fw-bold mb-1">All Tasks</Card.Title>
          <p className="small text-secondary mb-0">
            Sorted by urgency, due date, and completion progress
          </p>
        </div>
        <Badge bg="primary" pill className="px-3 py-2 tasks-count-badge">
          {tasks.length} visible
        </Badge>
      </Card.Header>

      <Card.Body className="p-3 p-xl-4">
        <div className="tasks-controls mb-4">
          <InputGroup className="tasks-search-wrap">
            <InputGroup.Text className="tasks-search-icon">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by title or subject"
              className="tasks-search-input"
            />
          </InputGroup>

          <Form.Select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
            className="tasks-select"
            aria-label="Filter tasks by status"
          >
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}
            className="tasks-select"
            aria-label="Sort tasks"
          >
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="progress">Sort: Progress</option>
          </Form.Select>
        </div>

        {loading ? (
          <div className="tasks-empty-state text-center py-5">
            <Spinner animation="border" size="sm" className="me-2" />
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="tasks-empty-state text-center py-5">
            <i className="bi bi-emoji-frown fs-2 d-block mb-2"></i>
            <h5 className="fw-bold">No matching tasks</h5>
            <p className="text-secondary mb-0">
              Adjust filters or search terms to see more results.
            </p>
          </div>
        ) : (
          <div className="tasks-list-items">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                {...task}
                onEdit={() => onEdit(task)}
                onComplete={() => onComplete(task.id)}
                onCycleStatus={() => onCycleStatus(task.id, task.rawStatus)}
                onDelete={() => onDelete(task)}
              />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskList;

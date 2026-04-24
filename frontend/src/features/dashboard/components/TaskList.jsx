import { Card, Button } from "react-bootstrap";
import { Link } from "react-router";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks = [], loading, error, onCompleteTask }) => {
  return (
    <Card className="task-list-card border-0 rounded-4">
      <Card.Header className="task-list-header px-4 py-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <Card.Title className="fw-bold mb-1">Smart Priority Queue</Card.Title>
          <div className="text-secondary small">
            Your tasks ranked by urgency and due dates
          </div>
        </div>


          <Button
            as={Link}
            to="/tasks"
            size="sm"
            variant="primary"
            className="rounded-pill px-3"
          >
            View All <i className="bi bi-arrow-right ms-1"></i>
          </Button>
      </Card.Header>

      <Card.Body className="p-3">
        {loading ? (
          <div className="text-center text-secondary py-5">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading tasks...
          </div>
        ) : error ? (
          <div className="text-center text-danger py-5">Unable to load tasks.</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-secondary py-5">
            <i className="bi bi-inbox fs-2 d-block mb-2"></i>
            No tasks yet
          </div>
        ) : (
          <div className="task-list-items">
            {tasks.map((task) => (
              <TaskItem key={task.id} {...task} onComplete={() => onCompleteTask?.(task.id)} />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskList;

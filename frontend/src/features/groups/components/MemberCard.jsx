import { Badge, Button, Form } from "react-bootstrap";
import MemberAvatar from "./MemberAvatar";
import StatusBadge, { getStatusMeta } from "./StatusBadge";

const MemberCard = ({
  member,
  currentStudentId,
  isOwner,
  onRemoveMember,
  onStatusChange,
}) => (
  <article className="group-member-card d-flex flex-column rounded-4 p-3">
    <div className="d-flex justify-content-between gap-2 align-items-start mb-3">
      <div className="d-flex align-items-center gap-2">
        <MemberAvatar name={member.name} />
        <div>
          <h6 className="fw-bold mb-0">{member.name}</h6>
          <p className="small text-secondary mb-0">{member.email}</p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <Badge bg={member.role === "admin" ? "primary" : "secondary"} pill>
          {member.role}
        </Badge>
        {isOwner && member.role !== "admin" && (
          <Button
            variant="outline-danger"
            size="sm"
            className="rounded-pill py-0 px-2"
            onClick={() => onRemoveMember?.(member.id)}
            title="Remove member"
          >
            <i className="bi bi-person-dash" />
          </Button>
        )}
      </div>
    </div>

    {member.tasks?.length > 0 && (
      <p className="small text-secondary mb-2">
        <i className="bi bi-list-check me-1" />
        {member.tasks.length} {member.tasks.length === 1 ? "task" : "tasks"}{" "}
        assigned
      </p>
    )}

    {member.tasks?.length ? (
      <div className="d-grid gap-2">
        {member.tasks.map((task) => {
          const canEdit = member.id === currentStudentId || isOwner;
          const statusMeta = getStatusMeta(task.status);

          return (
            <div
              key={task.assignmentId}
              className="member-task-item rounded-3 p-2"
            >
              <div className="fw-semibold small mb-2">{task.taskName}</div>
              <div className="d-flex gap-2 flex-wrap align-items-center">
                <Badge bg="light" text="dark" pill>
                  {task.subject}
                </Badge>

                {canEdit ? (
                  <Form.Select
                    size="sm"
                    className={`w-auto shadow-none d-inline-block text-white bg-${statusMeta.bg} border-0 rounded-pill py-0 px-3`}
                    style={{
                      minHeight: "24px",
                      fontSize: "0.75rem",
                    }}
                    value={task.status}
                    onChange={(event) =>
                      onStatusChange?.(task.taskId, event.target.value)
                    }
                    aria-label={`Status for ${task.taskName}`}
                  >
                    <option value="pending" className="text-dark bg-white">
                      Pending
                    </option>
                    <option value="in-progress" className="text-dark bg-white">
                      In Progress
                    </option>
                    <option value="completed" className="text-dark bg-white">
                      Completed
                    </option>
                  </Form.Select>
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="small text-secondary mb-0">
        <i className="bi bi-inbox me-1" />
        No tasks assigned yet.
      </p>
    )}
  </article>
);

export default MemberCard;

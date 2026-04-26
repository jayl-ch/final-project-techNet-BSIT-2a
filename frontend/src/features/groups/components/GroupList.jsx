import { Card, Badge, Button } from "react-bootstrap";

const GroupList = ({
  groups = [],
  loading,
  error,
  onReload,
  onDelete,
  selectedGroupId,
  onSelect,
}) => {
  return (
    <Card className="groups-list-card border-0 rounded-4">
      <Card.Header className="groups-list-header px-4 py-4 d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="fw-bold mb-1">My Groups</Card.Title>
          <p className="small text-secondary mb-0">
            Collaborate with classmates and organize work by team.
          </p>
        </div>
        <Badge bg="primary" pill className="px-3 py-2">
          {groups.length} groups
        </Badge>
      </Card.Header>

      <Card.Body className="p-3 p-xl-4">
        {loading ? (
          <div className="text-center py-5 text-secondary">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading groups...
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-danger mb-3">{error}</p>
            <Button variant="outline-primary" size="sm" onClick={onReload}>
              Try Again
            </Button>
          </div>
        ) : groups.length === 0 ? (
          <div className="groups-empty text-center py-5">
            <i className="bi bi-people fs-2 d-block mb-2" />
            <h5 className="fw-bold">No groups yet</h5>
            <p className="text-secondary mb-0">
              Create or join a group to start collaborating.
            </p>
          </div>
        ) : (
          <div className="groups-list-items">
            {groups.map((group) => (
              <article
                key={group.id}
                className={`group-item rounded-4 p-3 p-xl-4 ${
                  selectedGroupId === group.id ? "group-item-active" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => onSelect?.(group.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect?.(group.id);
                  }
                }}
              >
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                  <div>
                    <h5 className="fw-bold mb-1">{group.name}</h5>
                    <p className="text-secondary mb-0">Invite code: {group.inviteCode}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="info" pill>
                      {group.membersCount} members
                    </Badge>
                    {group.isOwner ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete?.(group.id);
                        }}
                      >
                        <i className="bi bi-trash3 me-1" />
                        Delete
                      </Button>
                    ) : (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-pill"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete?.(group.id);
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-1" />
                        Leave
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default GroupList;

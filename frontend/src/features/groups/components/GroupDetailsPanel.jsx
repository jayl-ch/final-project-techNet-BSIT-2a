import { Alert, Badge, Card, Spinner } from "react-bootstrap";
import AssignTaskForm from "./AssignTaskForm";
import EmptyGroupDetail from "./EmptyGroupDetail";
import GroupInfoStrip from "./GroupInfoStrip";
import MembersGrid from "./MembersGrid";

const GroupDetailsPanel = ({
  currentGroup,
  detailsLoading,
  detailsError,
  members = [],
  assignableTasks = [],
  assignableMembers = [],
  assignForm,
  assignLoading,
  assignError,
  onAssignChange,
  onAssignSubmit,
  onDismissAssignError,
  onLeaveGroup,
  onRemoveMember,
  onStatusChange,
  currentStudentId,
}) => {
  const isOwner = Boolean(currentGroup?.isOwner);

  return (
    <Card className="groups-list-card border-0 rounded-4 mt-4">
      <Card.Header className="groups-list-header px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <Card.Title className="fw-bold mb-1">
            Group Members &amp; Tasks
          </Card.Title>
          <p className="small text-secondary mb-0">
            View each member and their assigned tasks.
          </p>
        </div>
        {isOwner ? (
          <Badge bg="success" pill className="px-3 py-2">
            <i className="bi bi-shield-check me-1" />
            Admin View
          </Badge>
        ) : (
          <Badge bg="secondary" pill className="px-3 py-2">
            <i className="bi bi-person me-1" />
            Member View
          </Badge>
        )}
      </Card.Header>

      <Card.Body className="p-3 p-xl-4">
        {detailsError && !detailsLoading && (
          <Alert variant="danger" className="mb-3">
            {detailsError}
          </Alert>
        )}

        {detailsLoading ? (
          <div className="text-center py-5 text-secondary">
            <Spinner size="sm" className="me-2" />
            Loading group details...
          </div>
        ) : !currentGroup ? (
          <EmptyGroupDetail />
        ) : (
          <>
            <GroupInfoStrip group={currentGroup} onLeave={onLeaveGroup} />

            {isOwner && (
              <AssignTaskForm
                assignForm={assignForm}
                assignableTasks={assignableTasks}
                assignableMembers={assignableMembers}
                loading={assignLoading}
                error={assignError}
                onChange={onAssignChange}
                onSubmit={onAssignSubmit}
                onDismissError={onDismissAssignError}
              />
            )}

            <MembersGrid
              members={members}
              currentStudentId={currentStudentId}
              isOwner={isOwner}
              onRemoveMember={onRemoveMember}
              onStatusChange={onStatusChange}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default GroupDetailsPanel;

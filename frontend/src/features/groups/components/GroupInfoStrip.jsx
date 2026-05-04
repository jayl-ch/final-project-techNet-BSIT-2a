import { Button } from "react-bootstrap";

const GroupInfoStrip = ({ group, onLeave }) => (
  <div className="group-info-strip rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
    <div>
      <h5 className="fw-bold mb-1">{group.name}</h5>
      <p className="small text-secondary mb-0">
        <i className="bi bi-key me-1" />
        Invite code:&nbsp;
        <code className="user-select-all">{group.inviteCode}</code>
      </p>
    </div>
    {!group.isOwner && (
      <Button
        variant="outline-danger"
        size="sm"
        className="rounded-pill"
        onClick={onLeave}
      >
        <i className="bi bi-box-arrow-right me-1" />
        Leave Group
      </Button>
    )}
  </div>
);

export default GroupInfoStrip;

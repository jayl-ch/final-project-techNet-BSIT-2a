import { Button } from "react-bootstrap";

const GroupsHero = ({ today, onCreate, onJoin }) => (
  <>
    <div>
      <p className="groups-date mb-1">{today}</p>
      <h1 className="groups-title mb-2">Groups Hub</h1>
      <p className="groups-subtitle mb-0">
        Create teams, track collaboration, and stay aligned with your
        classmates.
      </p>
    </div>
    <div className="d-flex gap-2 flex-wrap">
      <Button
        className="rounded-pill px-4"
        variant="light"
        onClick={onCreate}
      >
        <i className="bi bi-plus-lg me-2" />
        Create Group
      </Button>
      <Button
        className="rounded-pill px-4"
        variant="outline-light"
        onClick={onJoin}
      >
        <i className="bi bi-person-plus me-2" />
        Join Group
      </Button>
    </div>
  </>
);

export default GroupsHero;

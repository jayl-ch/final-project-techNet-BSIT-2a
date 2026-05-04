import MemberCard from "./MemberCard";

const MembersGrid = ({
  members = [],
  currentStudentId,
  isOwner,
  onRemoveMember,
  onStatusChange,
}) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-4 text-secondary small">
        <i className="bi bi-people fs-4 d-block mb-2" />
        No members in this group yet.
      </div>
    );
  }

  return (
    <div className="groups-members-grid">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentStudentId={currentStudentId}
          isOwner={isOwner}
          onRemoveMember={onRemoveMember}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default MembersGrid;

const MemberAvatar = ({ name }) => {
  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="member-avatar rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
      <span className="fw-bold small">{initials}</span>
    </div>
  );
};

export default MemberAvatar;

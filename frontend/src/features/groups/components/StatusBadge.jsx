import { Badge } from "react-bootstrap";

const STATUS_META = {
  completed: { bg: "success", label: "Completed" },
  "in-progress": { bg: "info", label: "In Progress" },
  pending: { bg: "secondary", label: "Pending" },
};

export const getStatusMeta = (status) =>
  STATUS_META[status] ?? STATUS_META.pending;

const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);

  return (
    <Badge bg={meta.bg} pill>
      {meta.label}
    </Badge>
  );
};

export default StatusBadge;

import { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  Alert,
  Badge,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdminUsers } from "../hooks/useAdminUsers";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const shellVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const statusMeta = {
  pending: { label: "Pending", variant: "secondary" },
  "in-progress": { label: "In Progress", variant: "info" },
  completed: { label: "Completed", variant: "success" },
};

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeStatus = (value) => {
  if (value === "in-progress" || value === "completed") {
    return value;
  }

  return "pending";
};

const AdminPanel = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const handleUnauthorized = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);
  const handleForbidden = useCallback(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const { users, loading, error } = useAdminUsers(
    handleUnauthorized,
    handleForbidden,
  );

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const summary = useMemo(() => {
    const totalUsers = users.length;
    const developerCount = users.filter((user) => user.role === "developer").length;
    const totalGroups = users.reduce(
      (acc, user) => acc + (user.groups?.length || 0),
      0,
    );
    const totalCreatedTasks = users.reduce(
      (acc, user) => acc + (user.tasks?.created?.length || 0),
      0,
    );
    const totalAssignedTasks = users.reduce(
      (acc, user) => acc + (user.tasks?.assigned?.length || 0),
      0,
    );

    return {
      totalUsers,
      developerCount,
      totalGroups,
      totalCreatedTasks,
      totalAssignedTasks,
    };
  }, [users]);

  const statItems = useMemo(
    () => [
      {
        id: "users",
        label: "Total Users",
        value: summary.totalUsers,
        icon: "people",
        accent: "var(--ad-accent-blue)",
      },
      {
        id: "devs",
        label: "Developers",
        value: summary.developerCount,
        icon: "code-slash",
        accent: "var(--ad-accent-teal)",
      },
      {
        id: "groups",
        label: "Group Memberships",
        value: summary.totalGroups,
        icon: "collection",
        accent: "var(--ad-accent-orange)",
      },
      {
        id: "tasks",
        label: "Created Tasks",
        value: summary.totalCreatedTasks,
        icon: "check2-circle",
        accent: "var(--ad-accent-green)",
      },
      {
        id: "assigned",
        label: "Assigned Tasks",
        value: summary.totalAssignedTasks,
        icon: "arrow-repeat",
        accent: "var(--ad-accent-cyan)",
      },
    ],
    [summary],
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesQuery =
        !normalizedQuery ||
        user.name?.toLowerCase().includes(normalizedQuery) ||
        user.email?.toLowerCase().includes(normalizedQuery);

      return matchesRole && matchesQuery;
    });
  }, [query, roleFilter, users]);

  return (
    <MotionDiv
      className="admin admin-shell"
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      <MotionSection
        className="admin-hero mb-4 mb-xl-5"
        variants={prefersReducedMotion ? undefined : itemVariants}
      >
        <div>
          <p className="admin-date mb-2">{today}</p>
          <h1 className="admin-title mb-2">Developer Admin Panel</h1>
          <p className="admin-subtitle mb-0">
            Review student accounts, group participation, and task activity at a glance.
          </p>
        </div>
        <Badge bg="light" text="dark" pill className="px-3 py-2 fw-semibold">
          Developer Access
        </Badge>
      </MotionSection>

      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <Row className="g-3 g-xl-4 mb-4 mb-xl-5">
          {statItems.map((stat) => (
            <Col key={stat.id} xl={2} lg={4} md={6} sm={6}>
              <Card className="admin-stat-card border-0 rounded-4 h-100">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="admin-stat-label mb-1">{stat.label}</p>
                    <div className="admin-stat-value">{stat.value}</div>
                  </div>
                  <div className="admin-stat-icon" style={{ color: stat.accent }}>
                    <i className={`bi bi-${stat.icon}`} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </MotionDiv>

      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <Card className="admin-filter-card border-0 rounded-4 mb-4">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col lg={6} md={12}>
                <Form.Label className="admin-filter-label">Search users</Form.Label>
                <Form.Control
                  className="admin-filter-input"
                  placeholder="Search by name or email"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Col>
              <Col lg={3} md={6}>
                <Form.Label className="admin-filter-label">Role</Form.Label>
                <Form.Select
                  className="admin-filter-input"
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                >
                  <option value="all">All roles</option>
                  <option value="user">User</option>
                  <option value="developer">Developer</option>
                </Form.Select>
              </Col>
              <Col lg={3} md={6}>
                <Form.Label className="admin-filter-label">Quick stats</Form.Label>
                <div className="admin-filter-meta">
                  <span>{filteredUsers.length} visible</span>
                  <span>{summary.totalUsers} total</span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </MotionDiv>

      {error && (
        <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        </MotionDiv>
      )}

      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <Card className="admin-list-card border-0 rounded-4">
          <Card.Header className="admin-list-header px-4 py-3">
            <div>
              <h5 className="fw-bold mb-1">User Directory</h5>
              <p className="text-secondary small mb-0">
                Expand a user to review their groups and tasks.
              </p>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            {loading ? (
              <div className="text-center py-5 text-secondary">
                <Spinner animation="border" size="sm" className="me-2" />
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-secondary py-5">
                No users match your filters.
              </div>
            ) : (
              <Accordion alwaysOpen className="admin-accordion">
                {filteredUsers.map((user) => {
                  const createdTasks = user.tasks?.created || [];
                  const assignedTasks = user.tasks?.assigned || [];
                  const groupItems = user.groups || [];
                  const totalTasks = createdTasks.length + assignedTasks.length;

                  return (
                    <Accordion.Item
                      eventKey={String(user.id)}
                      key={user.id}
                      className="admin-user-card"
                    >
                      <Accordion.Header>
                        <div className="admin-user-header">
                          <div>
                            <div className="admin-user-name">{user.name}</div>
                            <div className="admin-user-email">
                              {user.email || "No email"}
                            </div>
                          </div>
                          <div className="admin-user-meta">
                            <Badge
                              bg={user.role === "developer" ? "primary" : "secondary"}
                              className="text-uppercase"
                            >
                              {user.role || "user"}
                            </Badge>
                            <div className="admin-user-counts">
                              <span>{groupItems.length} groups</span>
                              <span>{totalTasks} tasks</span>
                            </div>
                            <div className="admin-user-date">
                              Joined {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row className="g-3">
                          <Col lg={4} md={12}>
                            <Card className="admin-detail-card border-0 rounded-4 h-100">
                              <Card.Header className="admin-detail-header px-4 py-3">
                                <h6 className="mb-0 fw-bold">Groups</h6>
                              </Card.Header>
                              <Card.Body className="p-0">
                                {groupItems.length === 0 ? (
                                  <div className="admin-empty-state">
                                    No group memberships yet.
                                  </div>
                                ) : (
                                  <ListGroup variant="flush" className="admin-list">
                                    {groupItems.map((group) => (
                                      <ListGroup.Item
                                        key={`${user.id}-${group.id}`}
                                        className="admin-list-item"
                                      >
                                        <div>
                                          <div className="admin-list-title">
                                            {group.name}
                                          </div>
                                          <div className="admin-list-meta">
                                            {group.isOwner ? "Owner" : "Member"}
                                          </div>
                                        </div>
                                        <Badge
                                          bg={
                                            group.role === "admin"
                                              ? "primary"
                                              : "secondary"
                                          }
                                        >
                                          {group.role}
                                        </Badge>
                                      </ListGroup.Item>
                                    ))}
                                  </ListGroup>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col lg={8} md={12}>
                            <Card className="admin-detail-card border-0 rounded-4 h-100">
                              <Card.Header className="admin-detail-header px-4 py-3">
                                <h6 className="mb-0 fw-bold">Tasks</h6>
                              </Card.Header>
                              <Card.Body className="p-4">
                                <Row className="g-3">
                                  <Col md={6}>
                                    <div className="admin-section-title">Created</div>
                                    {createdTasks.length === 0 ? (
                                      <div className="admin-empty-state">
                                        No created tasks.
                                      </div>
                                    ) : (
                                      <ListGroup variant="flush" className="admin-list">
                                        {createdTasks.map((task) => {
                                          const status = normalizeStatus(task.status);
                                          const meta =
                                            statusMeta[status] || statusMeta.pending;

                                          return (
                                            <ListGroup.Item
                                              key={`${user.id}-${task.id}-created`}
                                              className="admin-list-item"
                                            >
                                              <div>
                                                <div className="admin-list-title">
                                                  {task.name}
                                                </div>
                                                <div className="admin-list-meta">
                                                  {task.subject || "General"}
                                                  {task.deadline
                                                    ? ` | Due ${formatDate(task.deadline)}`
                                                    : ""}
                                                </div>
                                              </div>
                                              <Badge bg={meta.variant}>{meta.label}</Badge>
                                            </ListGroup.Item>
                                          );
                                        })}
                                      </ListGroup>
                                    )}
                                  </Col>
                                  <Col md={6}>
                                    <div className="admin-section-title">Assigned</div>
                                    {assignedTasks.length === 0 ? (
                                      <div className="admin-empty-state">
                                        No assigned tasks.
                                      </div>
                                    ) : (
                                      <ListGroup variant="flush" className="admin-list">
                                        {assignedTasks.map((task) => {
                                          const status = normalizeStatus(task.status);
                                          const meta =
                                            statusMeta[status] || statusMeta.pending;

                                          return (
                                            <ListGroup.Item
                                              key={`${user.id}-${task.id}-assigned`}
                                              className="admin-list-item"
                                            >
                                              <div>
                                                <div className="admin-list-title">
                                                  {task.name}
                                                </div>
                                                <div className="admin-list-meta">
                                                  {task.groupName
                                                    ? `${task.groupName} | `
                                                    : ""}
                                                  {task.subject || "General"}
                                                  {task.deadline
                                                    ? ` | Due ${formatDate(task.deadline)}`
                                                    : ""}
                                                </div>
                                              </div>
                                              <Badge bg={meta.variant}>{meta.label}</Badge>
                                            </ListGroup.Item>
                                          );
                                        })}
                                      </ListGroup>
                                    )}
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            )}
          </Card.Body>
        </Card>
      </MotionDiv>
    </MotionDiv>
  );
};

export default AdminPanel;

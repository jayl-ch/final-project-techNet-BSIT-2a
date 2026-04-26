import { useCallback, useState } from "react";
import { Alert, Badge, Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import GroupList from "../components/GroupList";
import { useGroupsData } from "../hooks/useGroupsData";
import { motion, useReducedMotion } from "framer-motion";

const createInitialForm = {
  name: "",
  inviteCode: "",
};

const joinInitialForm = {
  code: "",
};

const assignInitialForm = {
  taskId: "",
  assignedTo: "",
};

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

const Groups = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams();
  const selectedGroupId = routeGroupId || null;
  const handleUnauthorized = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createForm, setCreateForm] = useState(createInitialForm);
  const [joinForm, setJoinForm] = useState(joinInitialForm);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [actionError, setActionError] = useState("");
  const [assignError, setAssignError] = useState("");
  const [assignForm, setAssignForm] = useState(assignInitialForm);

  const {
    groups,
    loading,
    error,
    reload,
    groupDetails,
    detailsLoading,
    detailsError,
    assignableTasks,
    addGroup,
    joinExistingGroup,
    deleteGroupById,
    leaveSelectedGroup,
    removeMemberFromGroup,
    assignTask,
  } = useGroupsData(handleUnauthorized, selectedGroupId);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleOpenCreate = () => {
    setCreateError("");
    setShowCreateModal(true);
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setCreateForm(createInitialForm);
    setCreateError("");
  };

  const handleOpenJoin = () => {
    setJoinError("");
    setShowJoinModal(true);
  };

  const handleCloseJoin = () => {
    setShowJoinModal(false);
    setJoinForm(joinInitialForm);
    setJoinError("");
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJoinChange = (event) => {
    const { name, value } = event.target;
    setJoinForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCreate = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    try {
      const createdGroupId = await addGroup({
        name: createForm.name.trim(),
        inviteCode: createForm.inviteCode.trim() || undefined,
      });
      handleCloseCreate();

      if (createdGroupId) {
        navigate(`/groups/${createdGroupId}`);
      }
    } catch (err) {
      setCreateError(err?.response?.data?.message || "Failed to create group.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSubmitJoin = async (event) => {
    event.preventDefault();
    setJoinLoading(true);
    setJoinError("");

    try {
      await joinExistingGroup({ code: joinForm.code.trim() });
      handleCloseJoin();
    } catch (err) {
      setJoinError(err?.response?.data?.message || "Failed to join group.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    setActionError("");
    try {
      await deleteGroupById(groupId);

      if (groupId === selectedGroupId) {
        navigate("/groups");
      }
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to delete group.");
    }
  };

  const handleLeaveGroup = async () => {
    setActionError("");
    try {
      await leaveSelectedGroup();
      navigate("/groups");
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to leave group.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    setActionError("");
    try {
      await removeMemberFromGroup(memberId);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to remove member.");
    }
  };

  const handleAssignChange = (event) => {
    const { name, value } = event.target;
    setAssignForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignTask = async (event) => {
    event.preventDefault();
    setAssignLoading(true);
    setAssignError("");

    try {
      await assignTask(assignForm);
      setAssignForm(assignInitialForm);
    } catch (err) {
      setAssignError(err?.response?.data?.message || "Failed to assign task.");
    } finally {
      setAssignLoading(false);
    }
  };

  const currentGroup = groupDetails?.group;
  const members = Array.isArray(groupDetails?.members) ? groupDetails.members : [];
  const assignableMemberOptions = members.filter((member) => member.role !== "admin");

  return (
    <MotionDiv
      className="groups groups-shell"
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      <MotionSection
        className="groups-hero mb-4 mb-xl-5"
        variants={prefersReducedMotion ? undefined : itemVariants}
      >
        <div>
          <p className="groups-date mb-2">{today}</p>
          <h1 className="groups-title mb-2">Groups Hub</h1>
          <p className="groups-subtitle mb-0">
            Create teams, track collaboration, and stay aligned with your classmates.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button className="rounded-pill px-4" variant="light" onClick={handleOpenCreate}>
            <i className="bi bi-plus-lg me-2" />
            Create Group
          </Button>
          <Button
            className="rounded-pill px-4"
            variant="outline-light"
            onClick={handleOpenJoin}
          >
            <i className="bi bi-person-plus me-2" />
            Join Group
          </Button>
        </div>
      </MotionSection>

      {error && !loading && (
        <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        </MotionDiv>
      )}

      {actionError && (
        <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
          <Alert variant="danger" className="mb-4">
            {actionError}
          </Alert>
        </MotionDiv>
      )}

      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <GroupList
          groups={groups}
          loading={loading}
          error={error}
          onReload={reload}
          onDelete={(groupId) => {
            const selectedGroup = groups.find((group) => group.id === groupId);

            if (selectedGroup?.isOwner) {
              return handleDeleteGroup(groupId);
            }

            return leaveSelectedGroup(groupId)
              .then(() => {
                if (groupId === selectedGroupId) {
                  navigate("/groups");
                }
              })
              .catch((err) => {
                setActionError(err?.response?.data?.message || "Failed to leave group.");
              });
          }}
          selectedGroupId={selectedGroupId}
          onSelect={(groupId) => navigate(`/groups/${groupId}`)}
        />
      </MotionDiv>

      {selectedGroupId && (
      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <Card className="groups-list-card border-0 rounded-4 mt-4">
          <Card.Header className="groups-list-header px-4 py-3 d-flex justify-content-between align-items-center">
            <div>
              <Card.Title className="fw-bold mb-1">Group Members & Assigned Tasks</Card.Title>
              <p className="small text-secondary mb-0">
                View each member and the tasks assigned by the group owner.
              </p>
            </div>
            {currentGroup?.isOwner ? (
              <Badge bg="success" pill>
                Admin View
              </Badge>
            ) : (
              <Badge bg="secondary" pill>
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
            <div className="text-center py-4 text-secondary">
              <span className="spinner-border spinner-border-sm me-2" />
              Loading group details...
            </div>
          ) : !currentGroup ? (
            <div className="groups-empty text-center py-4">
              <i className="bi bi-diagram-3 fs-2 d-block mb-2" />
              <h6 className="fw-bold mb-1">Group not found</h6>
              <p className="text-secondary mb-0">
                The selected group may have been removed or is unavailable.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <h5 className="fw-bold mb-1">{currentGroup.name}</h5>
                <p className="text-secondary mb-0">Invite code: {currentGroup.inviteCode}</p>
                {!currentGroup.isOwner && (
                  <div className="mt-3">
                    <Button variant="outline-secondary" size="sm" onClick={handleLeaveGroup}>
                      <i className="bi bi-box-arrow-right me-1" />
                      Leave Group
                    </Button>
                  </div>
                )}
              </div>

              {currentGroup.isOwner && (
                <Card className="border-0 rounded-4 mb-4 group-assignment-box">
                  <Card.Body>
                    <h6 className="fw-bold mb-3">Assign Task to Member</h6>
                    {assignError && (
                      <Alert variant="danger" className="mb-3">
                        {assignError}
                      </Alert>
                    )}

                    <Form onSubmit={handleAssignTask} className="row g-2 align-items-end">
                      <div className="col-md-5">
                        <Form.Label className="small">Task</Form.Label>
                        <Form.Select
                          name="taskId"
                          value={assignForm.taskId}
                          onChange={handleAssignChange}
                          required
                        >
                          <option value="">Select task</option>
                          {assignableTasks.map((task) => (
                            <option key={task._id} value={task._id}>
                              {task.name || "Untitled Task"}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="col-md-5">
                        <Form.Label className="small">Member</Form.Label>
                        <Form.Select
                          name="assignedTo"
                          value={assignForm.assignedTo}
                          onChange={handleAssignChange}
                          required
                        >
                          <option value="">Select member</option>
                          {assignableMemberOptions.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="col-md-2 d-grid">
                        <Button type="submit" disabled={assignLoading}>
                          {assignLoading ? "Assigning..." : "Assign"}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              <div className="groups-members-grid">
                {members.map((member) => (
                  <article key={member.id} className="group-member-card rounded-4 p-3">
                    <div className="d-flex justify-content-between gap-2 align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-1">{member.name}</h6>
                        <p className="small text-secondary mb-0">{member.email}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={member.role === "admin" ? "primary" : "secondary"} pill>
                          {member.role}
                        </Badge>
                        {currentGroup.isOwner && member.role !== "admin" && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    {member.tasks?.length ? (
                      <div className="d-grid gap-2 mt-2">
                        {member.tasks.map((task) => (
                          <div key={task.assignmentId} className="member-task-item rounded-3 p-2">
                            <div className="fw-semibold small mb-1">{task.taskName}</div>
                            <div className="d-flex gap-2 flex-wrap">
                              <Badge bg="light" text="dark" pill>
                                {task.subject}
                              </Badge>
                              <Badge
                                bg={
                                  task.status === "completed"
                                    ? "success"
                                    : task.status === "in-progress"
                                      ? "info"
                                      : "secondary"
                                }
                                pill
                              >
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="small text-secondary mb-0">No tasks assigned yet.</p>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
          </Card.Body>
        </Card>
      </MotionDiv>
      )}

      <Modal show={showCreateModal} onHide={handleCloseCreate} centered>
        <Form onSubmit={handleSubmitCreate}>
          <Modal.Header closeButton>
            <Modal.Title>Create Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}

            <Form.Group className="mb-3" controlId="group-name">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                name="name"
                maxLength={20}
                required
                value={createForm.name}
                onChange={handleCreateChange}
                placeholder="Enter group name"
              />
            </Form.Group>

            <Form.Group controlId="group-invite-code">
              <Form.Label>Invite Code (optional)</Form.Label>
              <Form.Control
                name="inviteCode"
                value={createForm.inviteCode}
                onChange={handleCreateChange}
                placeholder="Leave empty to auto-generate on backend"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseCreate}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={createLoading}>
              {createLoading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showJoinModal} onHide={handleCloseJoin} centered>
        <Form onSubmit={handleSubmitJoin}>
          <Modal.Header closeButton>
            <Modal.Title>Join Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {joinError && <Alert variant="danger">{joinError}</Alert>}

            <Form.Group controlId="join-group-code">
              <Form.Label>Invite Code</Form.Label>
              <Form.Control
                name="code"
                required
                value={joinForm.code}
                onChange={handleJoinChange}
                placeholder="Enter invite code"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseJoin}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={joinLoading}>
              {joinLoading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Joining...
                </>
              ) : (
                "Join"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MotionDiv>
  );
};

export default Groups;

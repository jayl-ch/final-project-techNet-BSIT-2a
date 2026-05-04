import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import CreateGroupModal from "../components/CreateGroupModal";
import GroupDetailsPanel from "../components/GroupDetailsPanel";
import GroupList from "../components/GroupList";
import GroupsAlerts from "../components/GroupsAlerts";
import GroupsHero from "../components/GroupsHero";
import JoinGroupModal from "../components/JoinGroupModal";
import ConfirmActionModal from "../../../shared/ui/ConfirmActionModal";
import { useGroupsData } from "../hooks/useGroupsData";

const createInitialForm = { name: "", inviteCode: "" };
const joinInitialForm = { code: "" };
const assignInitialForm = { taskId: "", assignedTo: "" };

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
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
};

const Groups = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams();
  const selectedGroupId = routeGroupId ?? null;

  const handleUnauthorized = useCallback(
    () => navigate("/login", { replace: true }),
    [navigate],
  );

  /* ─── Modal / form state ─── */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [createForm, setCreateForm] = useState(createInitialForm);
  const [joinForm, setJoinForm] = useState(joinInitialForm);
  const [assignForm, setAssignForm] = useState(assignInitialForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [actionError, setActionError] = useState("");
  const [assignError, setAssignError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  /* ─── Data hook ─── */
  const {
    groups,
    loading,
    error,
    reload,
    groupDetails,
    detailsLoading,
    detailsError,
    assignableTasks,
    currentStudentId,
    addGroup,
    joinExistingGroup,
    deleteGroupById,
    leaveSelectedGroup,
    removeMemberFromGroup,
    assignTask,
    updateMemberTaskStatus,
  } = useGroupsData(handleUnauthorized, selectedGroupId);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  /* ─── Modal helpers ─── */
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
  const handleOpenDelete = (group) => {
    if (!group) {
      return;
    }

    setDeleteTarget({ id: group.id, name: group.name });
    setDeleteError("");
    setShowDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleCreateChange = ({ target: { name, value } }) =>
    setCreateForm((prev) => ({ ...prev, [name]: value }));

  const handleJoinChange = ({ target: { name, value } }) =>
    setJoinForm((prev) => ({ ...prev, [name]: value }));

  const handleAssignChange = ({ target: { name, value } }) =>
    setAssignForm((prev) => ({ ...prev, [name]: value }));

  /* ─── Submit handlers ─── */
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
      if (createdGroupId) navigate(`/groups/${createdGroupId}`);
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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteGroupById(deleteTarget.id);
      if (deleteTarget.id === selectedGroupId) navigate("/groups");
      handleCloseDelete();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Failed to delete group.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    setActionError("");
    try {
      await leaveSelectedGroup(groupId); // pass explicit id for list-level leave
      if (!groupId || groupId === selectedGroupId) navigate("/groups");
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to leave group.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    setActionError("");
    try {
      await removeMemberFromGroup(memberId);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to remove member.",
      );
    }
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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateMemberTaskStatus(taskId, newStatus);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update task status.",
      );
    }
  };

  /* ─── Derived state ─── */
  const currentGroup = groupDetails?.group;
  const members = Array.isArray(groupDetails?.members)
    ? groupDetails.members
    : [];
  const assignableMembers = members.filter((m) => m.role !== "admin");

  /* ══════════ RENDER ══════════ */
  return (
    <MotionDiv
      className="groups groups-shell"
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      {/* ── Hero ── */}
      <MotionSection
        className="groups-hero mb-4 mb-xl-5"
        variants={prefersReducedMotion ? undefined : itemVariants}
      >
        <GroupsHero
          today={today}
          onCreate={handleOpenCreate}
          onJoin={handleOpenJoin}
        />
      </MotionSection>

      {/* ── Global error alerts ── */}
      <GroupsAlerts
        error={error}
        loading={loading}
        actionError={actionError}
        onDismissActionError={() => setActionError("")}
        prefersReducedMotion={prefersReducedMotion}
        itemVariants={itemVariants}
      />

      {/* ── Group list ── */}
      <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
        <GroupList
          groups={groups}
          loading={loading}
          error={error}
          onReload={reload}
          onDelete={(group) =>
            group?.isOwner
              ? handleOpenDelete(group)
              : handleLeaveGroup(group?.id)
          }
          selectedGroupId={selectedGroupId}
          onSelect={(groupId) => navigate(`/groups/${groupId}`)}
        />
      </MotionDiv>

      {/* ── Group detail panel ── */}
      {selectedGroupId && (
        <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
          <GroupDetailsPanel
            currentGroup={currentGroup}
            detailsLoading={detailsLoading}
            detailsError={detailsError}
            members={members}
            assignableTasks={assignableTasks}
            assignableMembers={members}
            assignForm={assignForm}
            assignLoading={assignLoading}
            assignError={assignError}
            onAssignChange={handleAssignChange}
            onAssignSubmit={handleAssignTask}
            onDismissAssignError={() => setAssignError("")}
            onLeaveGroup={handleLeaveGroup}
            onRemoveMember={handleRemoveMember}
            onStatusChange={handleStatusChange}
            currentStudentId={currentStudentId}
          />
        </MotionDiv>
      )}

      {/* ── Create Group Modal ── */}
      <CreateGroupModal
        show={showCreateModal}
        onClose={handleCloseCreate}
        onSubmit={handleSubmitCreate}
        form={createForm}
        onChange={handleCreateChange}
        loading={createLoading}
        error={createError}
        onDismissError={() => setCreateError("")}
      />

      {/* ── Join Group Modal ── */}
      <JoinGroupModal
        show={showJoinModal}
        onClose={handleCloseJoin}
        onSubmit={handleSubmitJoin}
        form={joinForm}
        onChange={handleJoinChange}
        loading={joinLoading}
        error={joinError}
        onDismissError={() => setJoinError("")}
      />

      <ConfirmActionModal
        show={showDeleteModal}
        title="Delete group?"
        message={
          <>
            Delete <strong>{deleteTarget?.name || "this group"}</strong>? This
            action cannot be undone.
          </>
        }
        confirmLabel="Delete group"
        loadingLabel="Deleting..."
        loading={deleteLoading}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
        onDismissError={() => setDeleteError("")}
      />
    </MotionDiv>
  );
};

export default Groups;

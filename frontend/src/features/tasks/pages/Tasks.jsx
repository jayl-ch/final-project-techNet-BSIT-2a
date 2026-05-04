import { useCallback, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskFormModal from "../components/TaskFormModal";
import TasksHero from "../components/TasksHero";
import TasksSidebar from "../components/TasksSidebar";
import TasksStatsGrid from "../components/TasksStatsGrid";
import ConfirmActionModal from "../../../shared/ui/ConfirmActionModal";
import { useTasksData } from "../hooks/useTasksData";

const MotionDiv = motion.div;

const initialForm = {
  name: "",
  subject: "",
  difficulty: 3,
  deadline: "",
  status: "pending",
};

const toDateTimeLocalValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const shellVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.28,
      when: "beforeChildren",
      staggerChildren: 0.07,
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

const Tasks = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const handleUnauthorized = useCallback(() => {
    navigate("/login");
  }, [navigate]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formValues, setFormValues] = useState(initialForm);
  const [editValues, setEditValues] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const {
    loading,
    error,
    stats,
    completion,
    upcomingMilestones,
    visibleTasks,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    completeTask,
    cycleTaskStatus,
    removeTask,
    addTask,
    editTask,
  } = useTasksData(handleUnauthorized);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleOpenCreate = () => {
    setShowCreateModal(true);
    setSaveError("");
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setFormValues(initialForm);
    setSaveError("");
  };

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "difficulty" ? Number(value) : value,
    }));
  };

  const handleChangeEditForm = (event) => {
    const { name, value } = event.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: name === "difficulty" ? Number(value) : value,
    }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      await addTask(formValues);
      handleCloseCreate();
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Failed to create task.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTaskId(task.id);
    setEditValues({
      name: task.title || "",
      subject: task.subject || "",
      difficulty: Number(task.difficulty) || 3,
      deadline: toDateTimeLocalValue(task.deadlineISO),
      status: task.rawStatus || "pending",
    });
    setEditError("");
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingTaskId(null);
    setEditValues(initialForm);
    setEditError("");
  };

  const handleOpenDelete = (task) => {
    if (!task) {
      return;
    }

    setDeleteTarget({ id: task.id, title: task.title });
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleEditTask = async (event) => {
    event.preventDefault();

    if (!editingTaskId) {
      return;
    }

    setEditSaving(true);
    setEditError("");

    try {
      await editTask(editingTaskId, editValues);
      handleCloseEdit();
    } catch (err) {
      setEditError(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteSaving(true);
    setDeleteError("");

    try {
      await removeTask(deleteTarget.id);
      handleCloseDelete();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Failed to delete task.");
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <MotionDiv
      className="tasks tasks-shell"
      variants={prefersReducedMotion ? undefined : shellVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      <TasksHero
        dateLabel={today}
        onCreate={handleOpenCreate}
        motionVariants={prefersReducedMotion ? undefined : itemVariants}
      />

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <TasksStatsGrid
        stats={stats}
        motionVariants={prefersReducedMotion ? undefined : itemVariants}
      />

      <Row className="g-4 align-items-start">
        <Col xl={8}>
          <MotionDiv variants={prefersReducedMotion ? undefined : itemVariants}>
            <TaskList
              loading={loading}
              tasks={visibleTasks}
              query={query}
              onQueryChange={setQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onEdit={handleOpenEdit}
              onComplete={completeTask}
              onCycleStatus={cycleTaskStatus}
              onDelete={handleOpenDelete}
            />
          </MotionDiv>
        </Col>

        <TasksSidebar
          completion={completion}
          stats={stats}
          upcomingMilestones={upcomingMilestones}
          motionVariants={prefersReducedMotion ? undefined : itemVariants}
        />
      </Row>

      <TaskFormModal
        show={showCreateModal}
        title="Create Task"
        submitLabel="Create Task"
        loadingLabel="Creating..."
        onClose={handleCloseCreate}
        onSubmit={handleCreateTask}
        values={formValues}
        onChange={handleChangeForm}
        saving={saving}
        error={saveError}
        idPrefix="task"
      />

      <TaskFormModal
        show={showEditModal}
        title="Edit Task"
        submitLabel="Save Changes"
        loadingLabel="Saving..."
        onClose={handleCloseEdit}
        onSubmit={handleEditTask}
        values={editValues}
        onChange={handleChangeEditForm}
        saving={editSaving}
        error={editError}
        idPrefix="task-edit"
      />

      <ConfirmActionModal
        show={showDeleteModal}
        title="Delete task?"
        message={
          <>
            Delete <strong>{deleteTarget?.title || "this task"}</strong>? This
            action cannot be undone.
          </>
        }
        confirmLabel="Delete task"
        loadingLabel="Deleting..."
        loading={deleteSaving}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
        onDismissError={() => setDeleteError("")}
      />
    </MotionDiv>
  );
};

export default Tasks;

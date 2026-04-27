import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { clearAuthToken, extractAuthErrorMessage } from "../../auth/api/authApi";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../api/tasksApi";

const statusMeta = {
  pending: { label: "Pending", variant: "secondary", progress: 15 },
  "in-progress": { label: "In Progress", variant: "info", progress: 55 },
  completed: { label: "Completed", variant: "success", progress: 100 },
};

const priorityMeta = {
  CRITICAL: { label: "Critical", color: "var(--tk-accent-red)", rank: 0 },
  MODERATE: { label: "Moderate", color: "var(--tk-accent-orange)", rank: 1 },
  LOW: { label: "Low", color: "var(--tk-accent-green)", rank: 2 },
};

const normalizeStatus = (status) => {
  if (status === "in-progress" || status === "completed") {
    return status;
  }

  return "pending";
};

const normalizePriority = (priorityLevel) => {
  const value = typeof priorityLevel === "string" ? priorityLevel.toUpperCase() : "LOW";
  if (value === "CRITICAL" || value === "MODERATE") {
    return value;
  }

  return "LOW";
};

const toTaskItem = (task) => {
  const normalizedStatus = normalizeStatus(task.status);
  const normalizedPriority = normalizePriority(task.priorityLevel);
  const statusInfo = statusMeta[normalizedStatus];
  const priorityInfo = priorityMeta[normalizedPriority];

  return {
    id: task._id,
    title: task.name || "Untitled Task",
    subject: task.subject || "General",
    deadlineISO: task.deadline,
    dueLabel: new Date(task.deadline).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    status: statusInfo.label,
    rawStatus: normalizedStatus,
    statusVariant: statusInfo.variant,
    progress: statusInfo.progress,
    difficulty: Number(task.difficulty) || 1,
    priority: priorityInfo.label,
    priorityLevel: normalizedPriority,
    priorityColor: priorityInfo.color,
    priorityRank: priorityInfo.rank,
  };
};

const parseDueDate = (value) => new Date(value).getTime();

const isOverdueTask = (task) => {
  if (!task?.deadlineISO || task.rawStatus === "completed") {
    return false;
  }

  return parseDueDate(task.deadlineISO) < Date.now();
};

export const useTasksData = (onUnauthorized) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchTasks();
      setTasks(Array.isArray(result) ? result : []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAuthToken();
        onUnauthorized?.();
        return;
      }

      setError(extractAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const taskItems = useMemo(() => {
    return tasks.map(toTaskItem);
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = taskItems.filter((task) => {
      const matchesStatus = statusFilter === "all" || task.rawStatus === statusFilter;
      const matchesQuery =
        normalized.length === 0 ||
        task.title.toLowerCase().includes(normalized) ||
        task.subject.toLowerCase().includes(normalized);

      return matchesStatus && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") {
        return a.priorityRank - b.priorityRank;
      }

      if (sortBy === "progress") {
        return b.progress - a.progress;
      }

      return parseDueDate(a.deadlineISO) - parseDueDate(b.deadlineISO);
    });
  }, [query, sortBy, statusFilter, taskItems]);

  const stats = useMemo(() => {
    const inProgressCount = taskItems.filter(
      (task) => task.rawStatus === "in-progress",
    ).length;
    const completedCount = taskItems.filter((task) => task.rawStatus === "completed").length;
    const overdueCount = taskItems.filter(isOverdueTask).length;

    return [
      {
        id: "total",
        label: "All Tasks",
        value: taskItems.length,
        icon: "collection",
        accent: "var(--tk-accent-cyan)",
      },
      {
        id: "progress",
        label: "In Progress",
        value: inProgressCount,
        icon: "lightning-charge-fill",
        accent: "var(--tk-accent-blue)",
      },
      {
        id: "done",
        label: "Completed",
        value: completedCount,
        icon: "check2-circle",
        accent: "var(--tk-accent-green)",
      },
      {
        id: "overdue",
        label: "Overdue",
        value: overdueCount,
        icon: "exclamation-triangle",
        accent: "var(--tk-accent-red)",
      },
    ];
  }, [taskItems]);

  const completion = useMemo(() => {
    const total = taskItems.length;
    if (!total) {
      return 0;
    }

    const completed = taskItems.filter((task) => task.rawStatus === "completed").length;
    return Math.round((completed / total) * 100);
  }, [taskItems]);

  const upcomingMilestones = useMemo(() => {
    return [...taskItems]
      .filter((task) => task.rawStatus !== "completed")
      .sort((a, b) => parseDueDate(a.deadlineISO) - parseDueDate(b.deadlineISO))
      .slice(0, 3)
      .map((task) => ({
        id: task.id,
        title: task.title,
        due: task.dueLabel,
        type: task.subject,
        variant: isOverdueTask(task) ? "danger" : "info",
      }));
  }, [taskItems]);

  const completeTask = useCallback(async (taskId) => {
    await updateTask(taskId, { status: "completed" });
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: "completed" } : task,
      ),
    );
  }, []);

  const cycleTaskStatus = useCallback(async (taskId, currentStatus) => {
    const nextStatus =
      currentStatus === "pending"
        ? "in-progress"
        : currentStatus === "in-progress"
          ? "completed"
          : "pending";

    await updateTask(taskId, { status: nextStatus });
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: nextStatus } : task,
      ),
    );
  }, []);

  const removeTask = useCallback(async (taskId) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
  }, []);

  const addTask = useCallback(async (taskPayload) => {
    const created = await createTask(taskPayload);

    if (created?._id) {
      setTasks((prev) => [created, ...prev]);
    } else {
      await loadTasks();
    }
  }, [loadTasks]);

  const editTask = useCallback(async (taskId, taskPayload) => {
    const updated = await updateTask(taskId, taskPayload);

    if (!updated?._id) {
      await loadTasks();
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, ...updated } : task,
      ),
    );
  }, [loadTasks]);

  return {
    loading,
    error,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    visibleTasks,
    stats,
    completion,
    upcomingMilestones,
    reload: loadTasks,
    completeTask,
    cycleTaskStatus,
    removeTask,
    addTask,
    editTask,
  };
};

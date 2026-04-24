import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { clearAuthToken, extractAuthErrorMessage } from "../../auth/api/authApi";
import { fetchDashboardData, updateTaskStatus } from "../api/dashboardApi";

const isSameDay = (firstDate, secondDate) => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const normalizePriorityLevel = (priorityLevel) => {
  if (typeof priorityLevel !== "string") {
    return "LOW";
  }

  const normalized = priorityLevel.toUpperCase();
  if (normalized === "CRITICAL" || normalized === "MODERATE") {
    return normalized;
  }

  return "LOW";
};

const priorityMeta = {
  CRITICAL: {
    label: "Critical",
    color: "var(--db-accent-red)",
  },
  MODERATE: {
    label: "Moderate",
    color: "var(--db-accent-orange)",
  },
  LOW: {
    label: "Low",
    color: "var(--db-accent-green)",
  },
};

const getTaskDeadlineStatus = (deadline) => {
  const today = new Date();
  const targetDate = new Date(deadline);
  const daysUntilDeadline = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (targetDate < today && !isSameDay(targetDate, today)) {
    return { label: "Overdue", variant: "danger" };
  }

  if (isSameDay(targetDate, today)) {
    return { label: "Due Today", variant: "warning" };
  }

  if (daysUntilDeadline <= 3) {
    return { label: "Soon", variant: "primary" };
  }

  return { label: "Upcoming", variant: "success" };
};

const normalizeTaskStatus = (status) => {
  if (status === "in-progress" || status === "completed") {
    return status;
  }

  return "pending";
};

const taskStatusMeta = {
  pending: {
    label: "Pending",
    variant: "secondary",
  },
  "in-progress": {
    label: "In Progress",
    variant: "info",
  },
  completed: {
    label: "Completed",
    variant: "success",
  },
};

const buildTaskItem = (task) => {
  const deadlineStatus = getTaskDeadlineStatus(task.deadline);
  const normalizedStatus = normalizeTaskStatus(task.status);
  const workflowStatus = taskStatusMeta[normalizedStatus];
  const normalizedPriorityLevel = normalizePriorityLevel(task.priorityLevel);
  const taskPriorityMeta = priorityMeta[normalizedPriorityLevel];

  return {
    id: task._id,
    title: task.name || "Untitled Task",
    subject: task.subject || "General",
    date: new Date(task.deadline).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    priority: taskPriorityMeta.label,
    priorityColor: taskPriorityMeta.color,
    priorityLevel: normalizedPriorityLevel,
    status: workflowStatus.label,
    statusVariant: workflowStatus.variant,
    rawStatus: normalizedStatus,
    deadlineStatus: deadlineStatus.label,
    deadlineStatusVariant: deadlineStatus.variant,
    deadline: task.deadline,
  };
};

export const useDashboardData = (onUnauthorized) => {
  const [student, setStudent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchDashboardData();
      setStudent(data.student);
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
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
    loadDashboardData();
  }, [loadDashboardData]);

  const completeTask = useCallback(async (taskId) => {
    try {
      await updateTaskStatus(taskId, "completed");
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task
        )
      );
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  }, []);

  const taskItems = useMemo(() => {
    return [...tasks]
      .sort((left, right) => {
        const leftStatus = normalizeTaskStatus(left.status);
        const rightStatus = normalizeTaskStatus(right.status);

        if (leftStatus === "completed" && rightStatus !== "completed") {
          return 1;
        }

        if (leftStatus !== "completed" && rightStatus === "completed") {
          return -1;
        }

        return new Date(left.deadline) - new Date(right.deadline);
      })
      .map(buildTaskItem);
  }, [tasks]);

  const stats = useMemo(() => {
    const pendingCount = taskItems.filter(
      (task) => task.rawStatus === "pending",
    ).length;
    const inProgressCount = taskItems.filter(
      (task) => task.rawStatus === "in-progress",
    ).length;
    const completedCount = taskItems.filter(
      (task) => task.rawStatus === "completed",
    ).length;

    return [
      {
        id: "total",
        icon: "clipboard-data",
        accent: "var(--db-accent-blue)",
        value: taskItems.length,
        label: "Total Tasks",
      },
      {
        id: "pending",
        icon: "calendar-day",
        accent: "var(--db-accent-blue)",
        value: pendingCount,
        label: "Pending",
      },
      {
        id: "in-progress",
        icon: "arrow-repeat",
        accent: "var(--db-accent-orange)",
        value: inProgressCount,
        label: "In Progress",
      },
      {
        id: "completed",
        icon: "check2-circle",
        accent: "var(--db-accent-green)",
        value: completedCount,
        label: "Completed",
      },
    ];
  }, [taskItems]);

  const deadlines = useMemo(() => {
    return taskItems
      .filter((task) => task.rawStatus !== "completed")
      .slice(0, 4)
      .map((task) => {
        const icon = task.deadlineStatus === "Due Today" ? "clock" : "calendar3";

        return {
          title: task.title,
          time: new Date(task.deadline).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
          icon,
          badgeLabel: task.deadlineStatus,
          badgeVariant: task.deadlineStatusVariant,
        };
      });
  }, [taskItems]);

  const progress = useMemo(() => {
    if (!taskItems.length) {
      return [];
    }

    const byStatus = taskItems.reduce((acc, task) => {
      const label = task.status || "Pending";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    const variantByStatus = {
      Pending: "secondary",
      "In Progress": "info",
      Completed: "success",
    };

    return Object.entries(byStatus)
      .sort((left, right) => right[1] - left[1])
      .map(([label, count]) => ({
        label,
        value: Math.round((count / taskItems.length) * 100),
        variant: variantByStatus[label] || "secondary",
      }));
  }, [taskItems]);

  return {
    student,
    taskItems,
    stats,
    deadlines,
    progress,
    loading,
    error,
    reload: loadDashboardData,
    completeTask,
  };
};
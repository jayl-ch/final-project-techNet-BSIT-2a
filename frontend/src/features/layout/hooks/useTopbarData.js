import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearAuthToken,
  getAuthStudent,
  authLogoutStudent,
} from "../../auth/api/authApi";
import { useNavigate } from "react-router-dom";
import { fetchTasks } from "../../tasks/api/tasksApi";

const isSameDay = (firstDate, secondDate) => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const normalizeTaskStatus = (status) => {
  if (status === "in-progress" || status === "completed") {
    return status;
  }

  return "pending";
};

const createNotification = ({
  id,
  title,
  message,
  variant,
  unread = true,
  icon,
}) => {
  return {
    id,
    title,
    message,
    variant,
    unread,
    icon,
  };
};

const SUPPORT_EMAIL = "support@taskwise.app";

const buildTaskNotifications = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [
      createNotification({
        id: "empty",
        title: "No notifications",
        message: "You are all caught up for now.",
        variant: "secondary",
        unread: false,
        icon: "bell",
      }),
    ];
  }

  const today = new Date();
  const activeTasks = tasks.filter(
    (task) => normalizeTaskStatus(task.status) !== "completed",
  );

  const overdueCount = activeTasks.filter((task) => {
    const deadline = new Date(task.deadline);
    return deadline < today && !isSameDay(deadline, today);
  }).length;

  const dueTodayCount = activeTasks.filter((task) => {
    return isSameDay(new Date(task.deadline), today);
  }).length;

  const dueSoonCount = activeTasks.filter((task) => {
    const deadline = new Date(task.deadline);
    const daysLeft = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysLeft > 0 && daysLeft <= 3;
  }).length;

  const inProgressCount = activeTasks.filter((task) => {
    return normalizeTaskStatus(task.status) === "in-progress";
  }).length;

  const notifications = [];

  if (overdueCount > 0) {
    notifications.push(
      createNotification({
        id: "overdue",
        title: "Overdue tasks",
        message: `${overdueCount} task${overdueCount > 1 ? "s are" : " is"} overdue.`,
        variant: "danger",
        icon: "exclamation-triangle-fill",
      }),
    );
  }

  if (dueTodayCount > 0) {
    notifications.push(
      createNotification({
        id: "today",
        title: "Tasks due today",
        message: `${dueTodayCount} task${dueTodayCount > 1 ? "s" : ""} due today.`,
        variant: "warning",
        icon: "calendar-event",
      }),
    );
  }

  if (dueSoonCount > 0) {
    notifications.push(
      createNotification({
        id: "soon",
        title: "Upcoming deadlines",
        message: `${dueSoonCount} task${dueSoonCount > 1 ? "s" : ""} due within 3 days.`,
        variant: "primary",
        icon: "clock-history",
      }),
    );
  }

  if (inProgressCount > 0) {
    notifications.push(
      createNotification({
        id: "in-progress",
        title: "Tasks in progress",
        message: `${inProgressCount} task${inProgressCount > 1 ? "s are" : " is"} currently in progress.`,
        variant: "info",
        icon: "arrow-repeat",
      }),
    );
  }

  if (!notifications.length) {
    notifications.push(
      createNotification({
        id: "clear",
        title: "No urgent updates",
        message: "No overdue or near-deadline tasks right now.",
        variant: "success",
        unread: false,
        icon: "check2-circle",
      }),
    );
  }

  return notifications;
};

const isUnauthorizedError = (error) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export const useTopbarData = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => notification.unread).length;
  }, [notifications]);

  const handleUnauthorized = useCallback(() => {
    clearAuthToken();
    navigate("/login", { replace: true });
  }, [navigate]);

  const studentQuery = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await getAuthStudent();
      return response?.data?.student ?? null;
    },
    staleTime: 30000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 30000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const studentName = studentQuery.data?.name || "Student";
  const studentEmail = studentQuery.data?.email || "";

  useEffect(() => {
    if (tasksQuery.error && !isUnauthorizedError(tasksQuery.error)) {
      setNotifications([
        createNotification({
          id: "error",
          title: "Notifications unavailable",
          message: "Unable to load notifications right now.",
          variant: "secondary",
          unread: false,
          icon: "bell",
        }),
      ]);
      return;
    }

    if (tasksQuery.data) {
      setNotifications(buildTaskNotifications(tasksQuery.data));
    }
  }, [tasksQuery.data, tasksQuery.error]);

  const openProfileModal = useCallback(() => {
    setShowProfileModal(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setShowProfileModal(false);
  }, []);

  const openSupportModal = useCallback(() => {
    setShowSupportModal(true);
  }, []);

  const closeSupportModal = useCallback(() => {
    setShowSupportModal(false);
  }, []);

  const handleGoToProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    try {
      await authLogoutStudent();
    } finally {
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  }, [navigate, queryClient]);

  const handleSupport = useCallback(() => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  }, []);

  const handleReadNotification = useCallback((notificationId) => {
    setNotifications((current) => {
      return current.map((notification) => {
        if (notification.id !== notificationId) {
          return notification;
        }

        return {
          ...notification,
          unread: false,
        };
      });
    });
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((current) => {
      return current.map((notification) => ({
        ...notification,
        unread: false,
      }));
    });
  }, []);

  return {
    studentName,
    studentEmail,
    showProfileModal,
    showSupportModal,
    notifications,
    unreadCount,
    openProfileModal,
    closeProfileModal,
    openSupportModal,
    closeSupportModal,
    supportEmail: SUPPORT_EMAIL,
    handleGoToProfile,
    handleSignOut,
    handleSupport,
    handleReadNotification,
    handleMarkAllRead,
  };
};

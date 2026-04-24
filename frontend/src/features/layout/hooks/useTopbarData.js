import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiClient,
  clearAuthToken,
  getAuthStudent,
  authLogoutStudent,
} from "../../auth/api/authApi";
import { useNavigate } from "react-router-dom";

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

export const useTopbarData = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Student");
  const [studentEmail, setStudentEmail] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => notification.unread).length;
  }, [notifications]);

  useEffect(() => {
    let mounted = true;

    const loadTopbarData = async () => {
      const [studentResult, taskResult] = await Promise.allSettled([
        getAuthStudent(),
        apiClient.get("/api/task"),
      ]);

      const isUnauthorized = [studentResult, taskResult].some((result) => {
        return (
          result.status === "rejected" &&
          result.reason?.response?.status === 401
        );
      });

      if (isUnauthorized) {
        clearAuthToken();
        navigate("/login", { replace: true });
        return;
      }

      if (!mounted) {
        return;
      }

      if (studentResult.status === "fulfilled") {
        const student = studentResult.value?.data?.student;
        setStudentName(student?.name || "Student");
        setStudentEmail(student?.email || "");
      }

      if (taskResult.status === "fulfilled") {
        const tasks = Array.isArray(taskResult.value?.data?.tasks)
          ? taskResult.value.data.tasks
          : [];
        setNotifications(buildTaskNotifications(tasks));
        return;
      }

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
    };

    loadTopbarData();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const openProfileModal = useCallback(() => {
    setShowProfileModal(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setShowProfileModal(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await authLogoutStudent();
    navigate("/login", { replace: true });
  }, [navigate]);

  const handleSupport = useCallback(() => {
    window.location.href = "mailto:support@taskwise.app";
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
    notifications,
    unreadCount,
    openProfileModal,
    closeProfileModal,
    handleSignOut,
    handleSupport,
    handleReadNotification,
    handleMarkAllRead,
  };
};

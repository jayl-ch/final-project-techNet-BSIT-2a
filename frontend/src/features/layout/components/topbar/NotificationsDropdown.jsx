import { Dropdown, Button } from "react-bootstrap";

const NotificationsDropdown = ({
  notifications,
  unreadCount,
  onMarkAllRead,
  onReadNotification,
}) => {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        id="topbar-notifications-dropdown"
        variant="link"
        style={{ color: "var(--bs-body-color)" }}
        className="top-btn notification-btn border rounded-circle position-relative text-decoration-none"
      >
        <i className="bi bi-bell fs-6"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        align="end"
        className="shadow-sm border-0 rounded-4 mt-2"
        style={{ minWidth: "min(22rem, 90vw)" }}
      >
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <strong>Notifications</strong>
          <Button
            variant="link"
            className="p-0 text-decoration-none small"
            disabled={unreadCount === 0}
            onClick={onMarkAllRead}
          >
            Mark all read
          </Button>
        </div>

        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            className="dropdown-item py-3"
            onClick={() => onReadNotification(notification.id)}
          >
            <div className="d-flex align-items-start gap-2">
              <i
                className={`bi bi-${notification.icon || "bell"} text-${notification.variant} mt-1`}
              ></i>
              <div className="grow text-start">
                <div className="fw-semibold d-flex align-items-center gap-2">
                  {notification.title}
                  {notification.unread && (
                    <span className="badge rounded-pill text-bg-primary">New</span>
                  )}
                </div>
                <div className="small text-secondary">{notification.message}</div>
              </div>
            </div>
          </button>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;

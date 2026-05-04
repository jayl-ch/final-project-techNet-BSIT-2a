import { Navbar, Nav, Container } from "react-bootstrap";
import { useTheme } from "../../../app/providers/theme";
import { useTopbarData } from "../hooks/useTopbarData";
import ThemeToggleButton from "./topbar/ThemeToggleButton";
import NotificationsDropdown from "./topbar/NotificationsDropdown";
import ProfileDropdown from "./topbar/ProfileDropdown";

const Topbar = ({ onOpenSidebar = () => {} }) => {
  const { theme, toggleTheme } = useTheme();
  const {
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
  } = useTopbarData();

  return (
    <>
      <Navbar
        className="topbar border-bottom d-none py-0 d-lg-flex position-fixed"
        style={{ background: "var(--bs-body-bg)" }}
      >
        <Container fluid="lg">
          <Nav className="d-flex align-items-center gap-2 ms-auto">
            <ThemeToggleButton theme={theme} onToggleTheme={toggleTheme} />
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={handleMarkAllRead}
              onReadNotification={handleReadNotification}
            />
            <ProfileDropdown
              theme={theme}
              studentName={studentName}
              studentEmail={studentEmail}
              showProfileModal={showProfileModal}
              onOpenProfile={openProfileModal}
              onCloseProfile={closeProfileModal}
              onToggleTheme={toggleTheme}
              onSupport={handleSupport}
              onSignOut={handleSignOut}
            />
          </Nav>
        </Container>
      </Navbar>

      <Navbar
        className="topbar topbar-mobile border-bottom d-lg-none position-fixed"
        style={{ background: "var(--bs-body-bg)" }}
      >
        <Container fluid>
          <button
            type="button"
            className="topbar-menu-btn"
            aria-label="Open navigation"
            onClick={onOpenSidebar}
          >
            <i className="bi bi-list" aria-hidden="true"></i>
          </button>
          <Nav className="topbar-actions">
            <ThemeToggleButton theme={theme} onToggleTheme={toggleTheme} />
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={handleMarkAllRead}
              onReadNotification={handleReadNotification}
            />
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Topbar;

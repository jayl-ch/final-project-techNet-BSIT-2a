import { Nav, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import TaskWiseIcon from "../../../shared/ui/icon/TaskWiseIcon";
import { authLogoutStudent } from "../../auth/api/authApi";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "house-door",
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: "check2-square",
  },
  {
    name: "Groups",
    path: "/groups",
    icon: "people",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "person",
  },
];

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const handleLogout = async () => {
    await authLogoutStudent();
    onClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-header">
          <Link className="sidebar-brand" to="/dashboard">
            <TaskWiseIcon size={34} />
            <span>TaskWise</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.name}
              />
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile Offcanvas */}
      <Offcanvas
        show={isOpen}
        onHide={onClose}
        placement="start"
        className="sidebar-offcanvas d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="sidebar-brand">
            <TaskWiseIcon size={30} />
            <span>TaskWise</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column sidebar-nav">
            <div className="sidebar-nav-section">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  path={item.path}
                  icon={item.icon}
                  label={item.name}
                  onClick={onClose}
                />
              ))}
              <div className="sidebar-divider" />
              <SidebarItem
                path="/login"
                icon="box-arrow-right"
                label="Logout"
                onClick={handleLogout}
              />
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;

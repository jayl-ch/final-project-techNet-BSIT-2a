import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import TaskWiseIcon from "../../../shared/ui/icon/TaskWiseIcon";
import { authLogoutStudent } from "../../auth/api/authApi";

const Sidebar = () => {
  const handleLogout = async () => {
    await authLogoutStudent();
  };

  const navItem = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Tasks",
      path: "/tasks",
    },
    {
      name: "Groups",
      path: "/groups",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ];
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar border-end d-none d-lg-flex flex-column z-2">
        <div
          style={{
            padding: "20px",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <TaskWiseIcon />
          <span>TaskWise</span>
        </div>

        <nav
          className="pt-2 d-flex flex-column justify-content-between"
          style={{ height: "calc(100vh - 4.5rem)" }}
        >
          <div>
            <SidebarItem
              path="/dashboard"
              icon="house-door"
              label="Dashboard"
              active
            />
            <SidebarItem path="/tasks" icon="check2-square" label="Tasks" />
            <SidebarItem path="/groups" icon="people" label="Groups" />
            <SidebarItem path="/profile" icon="person" label="Profile" />
            <hr
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                margin: "8px 16px",
              }}
            />
            <SidebarItem
              path="/login"
              icon="box-arrow-right"
              label="Logout"
              onClick={handleLogout}
            />
          </div>
        </nav>
      </aside>

      {/* Mobile Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand={false}
        className="d-lg-none w-100 position-fixed top-0"
        style={{ zIndex: 1000 }}
      >
        <Container fluid="md">
          <Navbar.Brand className="ms-2">
            <TaskWiseIcon size={30} />
            <span className="ms-2">TaskWise</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="mobile-sidebar" />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              {navItem.map(({ name, path }) => (
                <Nav.Link as={Link} to={path}>
                  {name}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;

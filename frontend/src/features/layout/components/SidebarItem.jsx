import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, label, path = "", onClick }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => "sidebar-item " + (isActive ? "active" : "")}
    >
      <i className={`bi bi-${icon}`} style={{ fontSize: "16px" }}></i>
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;

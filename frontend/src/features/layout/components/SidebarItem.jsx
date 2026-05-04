import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, label, path = "", onClick }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => "sidebar-item " + (isActive ? "active" : "")}
    >
      <span className="sidebar-item-icon" aria-hidden="true">
        <i className={`bi bi-${icon}`}></i>
      </span>
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;

import { Nav } from "react-bootstrap";

const ThemeToggleButton = ({ theme, onToggleTheme }) => {
  return (
    <Nav.Link className="top-btn border rounded-circle" onClick={onToggleTheme}>
      <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon"} fs-6`}></i>
    </Nav.Link>
  );
};

export default ThemeToggleButton;

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AppLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ flex: 1 }} className="relative overflow-hidden">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;

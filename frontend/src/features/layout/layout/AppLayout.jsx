import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="layout-shell d-flex">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="layout-main flex-grow-1 relative overflow-hidden">
        <Topbar onOpenSidebar={handleOpenSidebar} />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;

import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../features/landing";
import { LoginPage, RegisterPage, ProtectedRoute } from "../features/auth";
import { AppLayout } from "../features/layout";
import { DashboardPage } from "../features/dashboard";
import { TasksPage } from "../features/tasks";
import { GroupsPage } from "../features/groups";
import { ProfilePage } from "../features/profile";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:groupId" element={<GroupsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRouter;

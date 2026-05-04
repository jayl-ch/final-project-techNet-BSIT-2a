import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../features/landing";
import {
  LoginPage,
  RegisterPage,
  ProtectedRoute,
  PublicRoute,
} from "../features/auth";
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
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;

import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../features/landing";
import { LoginPage, RegisterPage } from "../features/auth";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRouter;

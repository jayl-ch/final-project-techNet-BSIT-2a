import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthStudent } from "../api/authApi";

const PublicRoute = ({ children, redirectTo = "/dashboard" }) => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      try {
        await getAuthStudent();
        if (mounted) {
          setStatus("authenticated");
        }
      } catch {
        if (mounted) {
          setStatus("unauthenticated");
        }
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "authenticated") {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;

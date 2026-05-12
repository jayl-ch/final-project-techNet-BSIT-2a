import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthStudent } from "../api/authApi";

const DeveloperRoute = ({ children, redirectTo = "/dashboard" }) => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const verifyDeveloper = async () => {
      try {
        const response = await getAuthStudent();
        const role = response?.data?.student?.role;

        if (mounted) {
          setStatus(role === "developer" ? "authorized" : "forbidden");
        }
      } catch {
        if (mounted) {
          setStatus("unauthenticated");
        }
      }
    };

    verifyDeveloper();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default DeveloperRoute;

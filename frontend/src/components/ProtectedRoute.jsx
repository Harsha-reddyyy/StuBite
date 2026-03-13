import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  const redirectTarget = `${location.pathname}${location.search}${location.hash}`;
  const params = new URLSearchParams({
    auth: "login",
    redirect: redirectTarget
  });

  return <Navigate to={`/?${params.toString()}`} replace />;
}

export default ProtectedRoute;

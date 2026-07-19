import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

export function AdminProtectedRoute() {
  const location = useLocation();
  const { status } = useAuth();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (status !== "admin") {
    const requestedPath = [
      location.pathname,
      location.search,
      location.hash,
    ].join("");

    return (
      <Navigate to="/admin/login" replace state={{ from: requestedPath }} />
    );
  }

  return <Outlet />;
}

import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken, getUser } from "../utils/auth";

const GuestGuard = () => {
  const token = getAuthToken();
  const user = getUser();

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
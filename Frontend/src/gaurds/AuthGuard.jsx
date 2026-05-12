

import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken, getUser } from "../utils/auth";

const AuthGuard = ({ allowedRoles }) => {
  const token  = getAuthToken();
  const user =getUser();
  console.log(token, user);


  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
   
    const roleRedirects = {
      READER: "/",
      ADMIN: "/dashboard",
      BOOK_OWNER: "/dashboard",
    };

    return <Navigate to={roleRedirects[user.role] || "/"} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
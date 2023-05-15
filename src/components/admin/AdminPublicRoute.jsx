import { Navigate } from "react-router-dom";
import useCheckAdminAuth from "../../hooks/useCheckAdminAuth";

const AdminPublicRoute = ({ children }) => {
  const isLoggedIn = useCheckAdminAuth();

  return !isLoggedIn ? children : <Navigate to="/admin/dashboard" />;
};

export default AdminPublicRoute;

import { Navigate } from "react-router-dom";
import useCheckAdminAuth from "../../hooks/useCheckAdminAuth";

const AdminPrivateRoute = ({ children }) => {
  const isLoggedIn = useCheckAdminAuth();

  return isLoggedIn ? children : <Navigate to="/admin" />;
};

export default AdminPrivateRoute;

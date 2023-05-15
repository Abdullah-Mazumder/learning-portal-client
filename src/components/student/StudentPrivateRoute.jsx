import { Navigate } from "react-router-dom";
import useCheckStudentAuth from "../../hooks/useCheckStudentAuth";

const StudentPrivateRoute = ({ children }) => {
  const isLoggedIn = useCheckStudentAuth();

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default StudentPrivateRoute;

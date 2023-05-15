import { Navigate } from "react-router-dom";
import useCheckStudentAuth from "../../hooks/useCheckStudentAuth";
const StudentPublicRoute = ({ children }) => {
  const isLoggedIn = useCheckStudentAuth();
  return !isLoggedIn ? children : <Navigate to="/course" />;
};

export default StudentPublicRoute;

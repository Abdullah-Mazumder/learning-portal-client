import { useSelector } from "react-redux";

const useCheckStudentAuth = () => {
  const auth = useSelector((state) => state.auth);

  if (auth?.user && auth.user.role === "student") {
    return true;
  }
  return false;
};

export default useCheckStudentAuth;

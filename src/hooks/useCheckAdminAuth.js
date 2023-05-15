import { useSelector } from "react-redux";

const useCheckAdminAuth = () => {
  const auth = useSelector((state) => state.auth);

  if (auth?.user && auth.user.role === "admin") {
    return true;
  }
  return false;
};

export default useCheckAdminAuth;

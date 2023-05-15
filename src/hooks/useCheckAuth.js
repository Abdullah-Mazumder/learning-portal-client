import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

const useCheckAuth = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    const localAuth = localStorage.getItem("LWSLearningPortalAppAuth");

    if (localAuth) {
      const auth = JSON.parse(localAuth);
      if (auth?.user) {
        dispatch(userLoggedIn(auth.user));
      }
    }
    setAuthChecked(true);
  }, [dispatch]);

  return authChecked;
};

export default useCheckAuth;

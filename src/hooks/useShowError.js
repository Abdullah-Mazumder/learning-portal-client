import { useEffect, useState } from "react";
import errorToast from "../utils/errorToast";

const useShowError = (isError, error) => {
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError]);

  useEffect(() => {
    if (showError) {
      errorToast(error);
      setShowError(false);
    }
  }, [showError, error]);
};

export default useShowError;

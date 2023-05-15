import { toast } from "react-toastify";

const errorToast = (msg = "Something went wrong!") => {
  toast.error(msg, {
    theme: "dark",
    toastId: "error",
  });
};

export default errorToast;

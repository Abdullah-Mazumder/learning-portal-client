import { toast } from "react-toastify";

export const warningToast = (msg) => {
  toast.warning(msg, {
    theme: "dark",
    toastId: "warning",
  });
};

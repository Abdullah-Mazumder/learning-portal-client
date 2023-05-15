import { toast } from "react-toastify";

const successToast = (msg) => {
  toast.success(msg, {
    theme: "dark",
    toastId: "success",
  });
};

export default successToast;

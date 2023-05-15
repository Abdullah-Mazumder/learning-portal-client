import { useEffect } from "react";

const useAddTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return {};
};

export default useAddTitle;

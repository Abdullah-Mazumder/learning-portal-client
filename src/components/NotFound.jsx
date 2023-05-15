import React from "react";

const NotFound = ({ text }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="text-lg font-semibold py-2 px-14 bg-yellow-200 text-yellow-900 rounded-md">
        {text}
      </div>
    </div>
  );
};

export default NotFound;

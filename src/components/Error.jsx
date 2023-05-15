import React from "react";

const Error = ({ text = "There was an error occured!" }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="text-lg font-semibold py-2 px-14 bg-red-200 text-red-900 rounded-md">
        {text}
      </div>
    </div>
  );
};

export default Error;

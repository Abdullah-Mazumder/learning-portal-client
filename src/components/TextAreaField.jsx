import React from "react";

const TextAreaField = ({ label, labelFor, placeholder, ...props }) => {
  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={labelFor} className="leading-7 text-gray-200 mb-1">
        {label}
      </label>
      <textarea
        id={labelFor}
        {...props}
        name={labelFor}
        placeholder={placeholder}
        rows={3}
        className="w-[400px] bg-[#080E1B] rounded border border-blue-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
      />
    </div>
  );
};

export default TextAreaField;

import React from "react";

const ModalWrapper = ({ modal, setModal, children }) => {
  return (
    <div
      className={`w-full mt-[0!important] h-full bg-[#000000c2] transition-all absolute top-0 left-0 flex items-center justify-center ${
        modal ? "scale-100" : "scale-0"
      }`}
    >
      <div className="bg-[#0A1121] relative rounded-md">
        <div className="p-12">
          <div
            className="absolute top-5 right-5 cursor-pointer text-2xl font-semibold"
            onClick={() => setModal(false)}
          >
            X
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;

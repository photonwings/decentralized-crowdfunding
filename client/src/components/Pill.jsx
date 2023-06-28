import React from "react";
import { closeRed } from "../assets";

const Pill = ({ option, handleDelete, index }) => {
  const handleClick = () => {
    if (index >=0) {
      handleDelete(index);
    }
  };
  return (
    <span
      className="font-epilogue font-semibold text-[15px] text-white bg-[#13131a] px-4 py-2 rounded-full whitespace-nowrap cursor-pointer"
      onClick={handleClick}
    >
      {option}{" "}
      {index >= 0 && (
        <img src={closeRed} alt="Small Image" className="inline ml-2 w-4 h-4" />
      )}
    </span>
  );
};

export default Pill;

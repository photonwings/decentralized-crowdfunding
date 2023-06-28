import React, { useState } from "react";
import { search } from "../assets";
const SearchBar = ({
  placeholder,
  icon,
  style,
  isButtonHidden,
  handleSubmit,
}) => {
  const [text, setText] = useState("");
  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSendClick = () => {
    if (text === "") {
      alert("Please enter text before clicking send");
      return;
    }
    handleSubmit(text);
    setText("");
  };
  return (
    <div
      className={`lg:flex-1 flex flex-row  py-2 pl-4 pr-4 h-[52px]  rounded-[100px] ${style}`}
    >
      {/* search input text box */}
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={handleInputChange}
        className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
      />
      {/* search button */}
      {!isButtonHidden && (
        <div
          className="w-[70px] h-[30px] rounded-[20px] bg-[#1dc071] flex justify-center items-center cursor-pointer"
          onClick={handleSendClick}
        >
          <img
            src={icon}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;

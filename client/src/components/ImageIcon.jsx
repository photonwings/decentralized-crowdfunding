import React from "react";
import * as assets from "../assets";

const ImageIcon = ({ profileImage, getProfileIcon, selectedProfile }) => {
  const handleClick = () => {
    getProfileIcon(profileImage);
  };
  return (
    <div
      className={`w-[70px] h-[70px] rounded-full m-1 ${
        selectedProfile === profileImage ? "bg-[#1dc071]" : "bg-[#13131a]"
      }`}
      onClick={handleClick}
    >
      <img
        src={assets[profileImage]}
        alt="user"
        className="h-auto max-w-full rounded-full"
      />
    </div>
  );
};

export default ImageIcon;

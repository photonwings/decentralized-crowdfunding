import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logo, logoImage2 } from "../assets";
import { navlinks } from "../constants";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  // Gives gray background to selected icon
  <div
    className={`w-[48px] h-[48px] rounded-[10px] flex justify-center items-center 
    cursor-pointer ${isActive && isActive === name && "bg-[#2c2f32]"} 
     ${styles}`}
    onClick={handleClick}
  >
    {/* Changes the color of the selected icons */}
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <div className="w-[70px] h-[70px] rounded-[10px] bg-black flex justify-center items-center cursor-pointer">
          <img
            src={logoImage2}
            alt="user"
            className="w-[90%] h-[90%] object-contain"
          />
        </div>
      </Link>
      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                setIsActive(link.name);
                navigate(link.link);
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConnectWallet } from "@thirdweb-dev/react";

import axios from "axios";
import { useStateContext } from "../context";
import { CustomButton, SearchBar } from "./";
import * as assets from "../assets";
import { navlinks } from "../constants";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [user, setUser] = useState({
    publicAddr: "",
    nickName: "Connect wallet",
    icon: "tempUser",
  });

  const BASE_URL = process.env.REACT_APP_BASEURL || "http://localhost:4001/api";

  useEffect(() => {
    fetchUser();
  }, [address]);

  const fetchUser = async () => {
    if (address) {
      axios
        .get(`${BASE_URL}/get-users?publicAddr=${address}`)
        .then((response) => {
          setUser(response.data.result[0]);
          // console.log(response.data.result[0]);
        })
        .catch((error) => console.log("Error while fetching likes", error));
    } else {
      setUser({
        publicAddr: "",
        nickName: "Connet Wallet",
        icon: "tempUser",
      });
    }
  };
  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* whole searchbar container */}
      <SearchBar
        placeholder="Search Campaign"
        icon={assets.search}
        style="bg-[#1c1c24]"
      />
      {/* Connect to wallet button and profile icon */}
      <div className="sm:flex hidden flex-row justify-end gap-4">
        <ConnectWallet theme="dark" />

        <Link to="/profile">
          <div className="relative">
            <div
              className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            >
              <img
                src={assets[user.icon]}
                alt="user"
                className="h-auto max-w-full rounded-full"
              />
              {isTooltipVisible && (
                <div className="absolute z-10 p-2 bg-[#1c1c24] text-white rounded-md  ">
                  {user.nickName}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        {/* Homepage logo */}
        <div className="w-[40px] h-[40px] rounded-[10px] bg-black flex justify-center items-center cursor-pointer">
          <img
            src={assets.logoImage2}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
        {/* Hamburger menu logo */}
        <img
          src={assets.menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />
        {/* Menu items in lis form */}
        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <ConnectWallet theme="dark" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

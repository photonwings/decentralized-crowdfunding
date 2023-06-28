import React, { useEffect, useState } from "react";
import axios from "axios";

import * as assets from "../assets";
import { daysLeft } from "../utils";

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);
  const [ownerProfile, setOwnerProfile] = useState({});

  const BASE_URL = process.env.REACT_APP_BASEURL || "http://localhost:4001/api";

  useEffect(() => {
    fetchOwner();
  }, []);
  const fetchOwner = async () => {
    axios
      .get(`${BASE_URL}/get-users?publicAddr=${owner}`)
      .then((response) => {
        setOwnerProfile(response.data.result[0]);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
      />

      <div className="flex flex-col p-4">
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
            {title}
          </h3>
          <p className="mt-[5px] font-epilogue font-normal text-[13px] text-[#808191] text-left leading-[18px] truncate">
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[8px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {amountCollected}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Raised of {target}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px] text-center">
              {remainingDays <= 0 ? 0 : remainingDays}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img
              src={assets[ownerProfile.icon]}
              alt="user"
              className="h-auto max-w-full rounded-full"
            />
          </div>
          <div className="flex flex-col justify-center font-epilogue font-normal text-[12px] text-[#808191]">
            <p className="text-white mr-5">{ownerProfile.nickName}</p>
            <p className="text-[#b2b3bd]">{` ${owner
              .toString()
              .slice(0, 5)}...${owner.toString().slice(-4)}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCard;

import React from "react";
import { thirdweb } from "../assets";

const DonatorCard = ({ item, index }) => {
  return (
    <div
      key={`${item.donator}-${index}`}
      className="flex justify-between items-center gap-5 bg-[#13131a] p-[10px] rounded-[10px] px-4 mr-4 min-w-max"
    >
      <div className="m-[10px] flex flex-row items-center flex-wrap gap-[14px]">
        <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
          <img
            src={thirdweb}
            alt="user"
            className="w-[50%] h-[50%] object-contain"
          />
        </div>
        <div>
          <h4 className="font-epilogue font-semibold text-[14px] text-white ">
            {item.nickName}
          </h4>
          <p className="mt-[4px] font-epilogue font-semibold text-[12px] text-[#808191]">
            {`${item.donator.toString().slice(0, 5)}...${item.donator
              .toString()
              .slice(-4)}`}
          </p>
        </div>
      </div>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
        {item.donation} ETH
      </p>
    </div>
  );
};

export default DonatorCard;

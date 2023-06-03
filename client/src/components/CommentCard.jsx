import React from "react";
import { thirdweb } from "../assets";

const CommentCard = ({ item, index }) => {
  return (
    <div
      key={`${item.nickName}-${index}`}
      className=" bg-[#13131a] p-[10px] rounded-[10px] px-4 mr-4"
    >
      <div className="m-[10px] flex flex-row items-center flex-wrap gap-[10px]">
        <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
          <img
            src={thirdweb}
            alt="user"
            className="w-[50%] h-[50%] object-contain"
          />
        </div>
        <div className="flex gap-[10px]">
          <p
            className={`font-epilogue font-semibold text-[14px] text-white ${
              item.isOwner &&
              "bg-gray-600 px-[5px] py-[4px] w-fit rounded-[10px]"
            }`}
          >
            {item.nickName}
          </p>
          <p className="font-epilogue text-[16px] text-[#808191]">
            {item.dateOfComment}
          </p>
        </div>
      </div>
        <p className="pl-[60px] font-epilogue text-[16px] text-[#808191] leading-[26px] text-justify">
          {item.comment}
        </p>
    </div>
  );
};

export default CommentCard;

{
  /*
return (
    <div
      key={`${item.nickName}-${index}`}
      className="flex flex-row bg-[#13131a] p-[10px] rounded-[10px] px-4 mr-4"
    >
      <div className="m-[10px] flex flex-row items-center  gap-[14px]">
        <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
          <img
            src={thirdweb}
            alt="user"
            className="w-[50%] h-[50%] object-contain"
          />
        </div>
        <div>
          <div className="flex justify-between gap-4 max-w-fit">
            <p
              className={`font-epilogue font-semibold text-[14px] text-white ${
                item.isOwner &&
                "bg-gray-600 px-[5px] py-[4px] w-fit rounded-[10px]"
              }`}
            >
              {item.nickName}
            </p>
            <p className="font-epilogue text-[16px] text-[#808191]">
              {item.dateOfComment}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p className="mt-[4px] font-epilogue text-[16px] text-[#808191] leading-[26px] text-justify">
          {item.comment}
        </p>
      </div>
    </div>
  );

          */
}

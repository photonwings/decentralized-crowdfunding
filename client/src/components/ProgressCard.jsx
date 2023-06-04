import React from "react";

const ProgressCard = ({ index, item }) => {
  return (
    <div
      className=" bg-[#13131a] p-[10px] rounded-[10px] px-4 mr-4 "
    >
      <div className="m-[10px] flex flex-row items-center flex-wrap gap-[10px]">
        <div className="flex flex-col gap-[5px]">
          <h4 className="font-epilogue font-bold text-[16px] text-white ">
            {item.title}
          </h4>
          <p className="mt-[4px] font-epilogue text-[14px] text-[#808191]">
            {item.dateOfProgress}
          </p>
        </div>
      </div>
      <div className="mx-[10px] pb-[15px]">
        <p className="min-h-[200px] p-[20px] rounded-[10px] font-epilogue font-normal text-[16px] bg-[#1c1c24] text-[#808191] leading-[26px] ">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default ProgressCard;

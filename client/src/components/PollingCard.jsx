import React from "react";

const PollingCard = ({ index, item }) => {
  return (
    <div
      key={`${item.name}-${index}`}
      className="flex justify-between items-center gap-[100px] bg-[#13131a] p-[10px] rounded-[10px] px-4 mr-2 min-w-[320px] "
    >
      <div className="m-[10px] flex flex-row items-center flex-wrap gap-[10px]">
        <div className="">
          <input
            id={item.name}
            type="radio"
            value=""
            name="default-radio"
            className="w-4 h-4 cursor-pointer"
          />
          <label
            for={item.name}
            className="font-epilogue  text-[16px] text-white cursor-pointer pl-[10px] pd-[20px]"
          >
            {item.name}
          </label>
        </div>
      </div>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
        {item.percentage}%
      </p>
    </div>
  );
};
export default PollingCard;

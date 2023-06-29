import React from "react";
import { calculatePercentage } from "../utils";

const PollingCard = ({
  item,
  pollSummary,
  handleOptionClick,
  isDisabled,
  selectedOption,
}) => {
  console.log();
  return (
    <div
      className={`flex justify-between items-center gap-[100px] ${
        isDisabled && selectedOption === item.optionId
          ? "bg-[#1dc071]"
          : "bg-[#13131a]"
      } p-[10px] rounded-[10px] px-4 mr-2 min-w-[320px]`}
    >
      <div className="m-[10px] flex flex-row items-center flex-wrap gap-[10px]">
        <div className="">
          <input
            id={item.optionName}
            type="radio"
            value={item.optionId}
            name="default-radio"
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              handleOptionClick(item.optionId, item.count);
            }}
            disabled={isDisabled}
          />
          <label
            htmlFor={item.optionName}
            className="font-epilogue  text-[16px] text-white cursor-pointer pl-[10px] pd-[20px]"
          >
            {item.optionName}
          </label>
        </div>
      </div>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
        {calculatePercentage(item.count, pollSummary)} %
      </p>
    </div>
  );
};
export default PollingCard;

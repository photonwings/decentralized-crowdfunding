import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import {
  CountBox,
  CustomButton,
  Loader,
  DonatorCard,
  CommentCard,
  SearchBar,
} from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { send, thirdweb } from "../assets";
import { tempDonation, tempComment } from "../temp/data";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
    // console.log(data);
    setDonators(tempDonation);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    if (amount == "") {
      alert("Please enter donation amount");
      return;
    }
    setIsLoading(true);

    await donate(state.pId, amount);

    navigate("/");
    setIsLoading(false);
  };

  //! Pending implementation
  let likes = 21;
  let isLiked = true;
  const handleLike = () => {};
  const nickName = "PhotonWings";

  return (
    <div>
      {isLoading && <Loader />}
      {/* Upper portion: Image and count boxes */}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[20px]">
        {/* Image and progress bar */}
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-fill rounded-xl"
          />
          {/* Progress bar */}
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>
        {/* Countbox */}
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[10px]">
          <CountBox
            title="Days Left"
            value={remainingDays <= 0 ? 0 : remainingDays}
          />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
          <CustomButton
            btnType="button"
            title={`${likes} Likes`}
            styles={`w-[150px] ${isLiked ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}`}
            handleClick={handleLike}
          />
        </div>
        {/* Funding part */}
        <div className="flex-1">
          {/* <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Fund
          </h4> */}

          <div className="flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-white">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                required
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[30px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>
                <p className="mt-[30px] mb-[30px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the project for no reward, just because it speaks to
                  you.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom section: Creator, description and donors */}
      <div className="mt-[40px] flex lg:flex-row flex-col gap-5">
        <div className="flex flex-col gap-[40px]">
          {/* Creator and description*/}
          <div className="flex md:flex-row flex-col justify-between gap-[20px]">
            {/* Creator */}
            <div className="min-w-fit  bg-[#1c1c24] p-5 rounded-[10px]">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Creator
              </h4>

              <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                  <img
                    src={thirdweb}
                    alt="user"
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-epilogue font-semibold text-[14px] text-white ">
                    {nickName}
                  </h4>
                  <p className="mt-[4px] font-epilogue font-semibold text-[12px] text-[#808191]">
                    {`${state.owner.toString().slice(0, 5)}...${state.owner
                      .toString()
                      .slice(-4)}`}
                  </p>
                </div>
              </div>
            </div>
            {/* Story and description */}
            <div className="bg-[#1c1c24] p-5 rounded-[10px] ">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                {state.title}
              </h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  {state.description}
                </p>
              </div>
            </div>
          </div>
          {/* Donor list and comment*/}
          <div className="flex lg:flex-row flex-col justify-between gap-[20px]">
            <div className="bg-[#1c1c24] p-[20px] rounded-[10px]">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Donators
              </h4>

              <div className="mt-[20px]  flex flex-col gap-4 overflow-auto h-[570px] overflow-x-hidden">
                {donators.length > 0 ? (
                  donators.map((item, index) => (
                    <DonatorCard item={item} index={index} />
                  ))
                ) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                    No donators yet. Be the first one!
                  </p>
                )}
              </div>
            </div>
            {/* Comments */}
            <div className="w-full bg-[#1c1c24] p-[20px] rounded-[10px]">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Comments
              </h4>

              <div className="mt-[20px] mb-[20px] flex flex-col gap-4 overflow-auto h-[500px]">
                {tempComment.length > 0 ? (
                  tempComment.map((item, index) => (
                    <CommentCard item={item} index={index} />
                  ))
                ) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                    No Comments yet. Be the first one!
                  </p>
                )}
              </div>
              <SearchBar
                placeholder="Add a comment..."
                icon={send}
                style="bg-[#13131a] max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

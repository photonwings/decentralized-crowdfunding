import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ethers, providers } from "ethers";

import { useStateContext } from "../context";
import {
  CountBox,
  CustomButton,
  Loader,
  DonatorCard,
  CommentCard,
  SearchBar,
  PollingCard,
  FormField,
  Pill,
  BarChart,
  PieChart,
} from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
// import { close, pen, plus, send, thirdweb } from "../assets";
import * as assets from "../assets";
import {
  tempDonation,
  tempComment,
  tempPoll,
  tempProgress,
} from "../temp/data";
import ProgressCard from "../components/ProgressCard";
import { setSupportedChains } from "@thirdweb-dev/sdk";
import { useConnectionStatus, useSDK } from "@thirdweb-dev/react";
import DoughnutChart from "../components/DoughnutChart";

const CampaignDetails = () => {
  // const sdk = useSDK();
  // const fetchBalace = async () => {
  //   const balance = await sdk.wallet.getBalance();
  //   console.log(balance.displayValue);
  // };
  // fetchBalace();

  const connectionStatus = useConnectionStatus();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();
  const BASE_URL = import.meta.env.VITE_BASEURL;
  const User = Object.freeze({
    Owner: "owner",
    Donors: "donors",
    Commenters: "commenters",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(0);
  const [isVoted, setIsVoted] = useState({ optionId: 0, isVoted: 0 });
  const [ownerProfile, setOwnerProfile] = useState({});
  const [comments, setComments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [currentProgress, setCurrentProgress] = useState({
    progressTitle: "",
    description: "",
  });
  const [poll, setPoll] = useState({
    question: "No active poll",
    options: [],
  });
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [pollSum, setPollSum] = useState(0);
  const [graphType, setGraphType] = useState("barChart");

  const remainingDays = daysLeft(state.deadline);
  const fetchDonators = async () => {
    const donors = await getDonations(state.pId);
    const profiles = await fetchUser(
      User.Donors,
      ...donors.map((donator) => donator.donator)
    );
    const donorProfile = donors.map((donor) => {
      const profile = profiles.find(
        (profile) => profile.publicAddr === donor.donator
      );
      return { ...donor, ...profile };
    });
    setDonators(donorProfile);
  };

  useEffect(() => {
    if (contract) {
      fetchDonators();
      fetchLikes();
      fetchIsLiked();
      fetchUser(User.Owner, state.owner);
      fetchProgress();
      fetchComment();
      fetchPoll();
      fetchIsVoted();
    }
  }, [contract, address]);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    color: "#ffff",
    background: "#808080",
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleDonate = async () => {
    if (amount == "") {
      Toast.fire({
        icon: "warning",
        title: "Please enter valid ETH amount",
      });
      return;
    }
    if (connectionStatus !== "connected") {
      Toast.fire({
        icon: "warning",
        title: "Connect to wallet before donating",
      });
      return;
    }

    if (remainingDays <= 0) {
      Toast.fire({
        icon: "warning",
        title:
          "Oops!! Campaign deadline has expired. No more donations are being accepted.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await donate(state.pId, amount);
      console.log(data);
      navigate("/");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "warning",
        title: "Not sufficient balance",
      });
      return;
    }
  };

  const handleLikes = async () => {
    if (connectionStatus !== "connected") {
      Toast.fire({
        icon: "warning",
        title: "Connect to wallet before liking",
      });
      return;
    }
    axios
      .put(`${BASE_URL}/put-likes`, {
        like: isLiked ? likes - 1 : likes + 1,
        campaignAddr: state.pId,
      })
      .then((response) => {
        fetchLikes();
        handleIsLiked();
      })
      .catch((error) => console.log("Error while posting like", error));
  };

  const handleIsLiked = async () => {
    axios
      .put(`${BASE_URL}/put-is-liked`, {
        campaignAddr: state.pId,
        publicAddr: address,
        isLiked: isLiked ? 0 : 1,
      })
      .then((response) => {
        fetchLikes();
        fetchIsLiked();
      })
      .catch((error) => console.log("Error while posting like", error));
  };

  const fetchLikes = async () => {
    axios
      .get(`${BASE_URL}/get-likes/${state.pId}`)
      .then((response) => {
        setLikes(response.data.result.likes);
      })
      .catch((error) => console.log("Error while fetching likes", error));
  };

  const fetchIsLiked = async () => {
    if (address) {
      axios
        .get(`${BASE_URL}/get-is-liked/${state.pId}/${address}`)
        .then((response) => {
          setIsLiked(response.data.result.isLiked);
        })
        .catch((error) => console.log("Error while fetching isLiked", error));
    }
  };

  const fetchUser = async (type, ...addr) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/get-users?publicAddr=${addr.join(",")}`
      );
      if (type === User.Owner) {
        setOwnerProfile(response.data.result[0]);
      } else if (type === User.Donors) {
        return response.data.result;
      } else if (type === User.Commenters) {
        return response.data.result;
      }
    } catch (error) {
      console.log("Error while fetching users", error);
    }
  };
  const fetchProgress = async () => {
    axios
      .get(`${BASE_URL}/get-progress/${state.pId}`)
      .then((response) => {
        setProgress(response.data.result);
      })
      .catch((error) => console.log("Error while fetching likes", error));
  };
  const fetchComment = async () => {
    try {
      const comments = await axios.get(`${BASE_URL}/get-comments/${state.pId}`);
      const profiles = await fetchUser(
        User.Commenters,
        ...comments.data.result.map((comment) => comment.publicAddr)
      );
      const commenterProfile = comments.data.result.map((comment) => {
        const profile = profiles.find(
          (profile) => profile.publicAddr === comment.publicAddr
        );
        return { ...comment, ...profile };
      });
      setComments(commenterProfile);
    } catch (error) {
      console.log("Error while fetching comments and/or profile: ", error);
    }
  };

  const fetchPoll = async () => {
    let questionOptions = {
      question: "No active poll",
      options: [],
    };
    const question = await axios.get(`${BASE_URL}/get-question/${state.pId}`);
    if (question.data.result.length === 1) {
      const options = await axios.get(`${BASE_URL}/get-options/${state.pId}`);
      questionOptions = {
        question: question.data.result[0].question,
        options: options.data.result,
      };
      calculatePoll(questionOptions);
    }
    setPoll(questionOptions);
  };

  const calculatePoll = (poll) => {
    const pollOptions = poll.options;
    const sum = pollOptions.reduce((total, option) => total + option.count, 0);
    setPollSum(sum);
  };

  const handleCommentSubmit = async (comment) => {
    if (connectionStatus !== "connected") {
      Toast.fire({
        icon: "warning",
        title: "Connect to wallet before commenting",
      });
      return;
    }
    axios
      .post(`${BASE_URL}/create-comment`, {
        campaignAddr: state.pId,
        publicAddr: address,
        commentText: comment,
        isCreator: state.owner === address ? 1 : 0,
        dateOfComment: new Date(
          Date.now() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
        )
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      })
      .then((response) => {
        fetchComment();
      })
      .catch((error) => console.log("Error while createing comment: ", error));
  };
  const handleProgressFormChange = (fieldName, e) => {
    setCurrentProgress({ ...currentProgress, [fieldName]: e.target.value });
  };

  const handleProgressSubmit = () => {
    if (
      currentProgress.progressTitle === "" ||
      currentProgress.description === ""
    ) {
      Toast.fire({
        icon: "warning",
        title: "Enter title and description",
      });
      return;
    } else {
      axios
        .post(`${BASE_URL}/create-progress`, {
          campaignAddr: state.pId,
          progressTitle: currentProgress.progressTitle,
          description: currentProgress.description,
          dateOfProgress: new Date(
            Date.now() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
          )
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        })
        .then((response) => {
          setCurrentProgress({
            progressTitle: "",
            description: "",
          });
          fetchProgress();
        })
        .catch((error) =>
          console.log("Error while createing progress: ", error)
        );
    }
  };
  const handleAddOption = (option) => {
    setOptions((prev) => [...prev, option]);
  };
  const handlePollSubmit = async () => {
    if (poll.options.length !== 0) {
      console.log(poll.options);
      Toast.fire({
        icon: "warning",
        title: "Already poll is present",
      });
      return;
    }
    if (question == "") {
      Toast.fire({
        icon: "warning",
        title: "Please enter question",
      });
      return;
    }
    if (options.length < 2) {
      Toast.fire({
        icon: "warning",
        title: "Atleast 2 options shuld be present",
      });
      return;
    }

    console.log({
      campaignAddr: state.pId,
      question: question,
      options: options,
    });
    axios
      .post(`${BASE_URL}/create-poll`, {
        campaignAddr: state.pId,
        question: question,
        options: options,
      })
      .then((response) => {
        setQuestion("");
        setOptions("");
        fetchPoll();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePollClear = async () => {
    //Check if poll is not present
    if (poll.options.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "No poll is present to delete",
      });
      return;
    }
    Swal.fire({
      title: "Confirm deletion of poll",
      position: "top-end",
      toast: true,
      color: "#ffff",
      background: "#808080",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BASE_URL}/delete-poll/${state.pId}`)
          .then((response) => {
            console.log(response);
            fetchPoll();
            Toast.fire({
              icon: "success",
              title: "Poll is deleted",
            });
          })
          .catch((error) => console.log(error));
      }
    });
  };
  const deleteOption = (index) => {
    setOptions((prev) => {
      const updatedOptions = prev.filter((_, i) => i !== index);
      return updatedOptions;
    });
  };

  const fetchIsVoted = async () => {
    axios
      .get(`${BASE_URL}/get-is-voted/${state.pId}/${address}`)
      .then((response) => {
        if (response.data.result) {
          setIsVoted(response.data.result);
        }
      })
      .catch((error) => console.log("Error while fetching isVoted: ", error));
  };

  const handleOptionClick = async (optionId, count) => {
    if (connectionStatus !== "connected") {
      Toast.fire({
        icon: "warning",
        title: "Connect to wallet before voting",
      });
      return;
    }
    if (isVoted.isVoted === 1) {
      Toast.fire({
        icon: "warning",
        title: "Already voted",
      });
      return;
    }
    axios
      .put(`${BASE_URL}/put-option`, {
        optionId: optionId,
        campaignAddr: state.pId,
        publicAddr: address,
        count: count + 1,
      })
      .then((response) => {
        setIsLiked(1);
        fetchPoll();
        fetchIsVoted();
      })
      .catch((error) => {
        console.log("Error while updaing vote: ", error);
      });
  };
  return (
    <div className="mb-10 ">
      {isLoading && <Loader />}
      {/* Upper portion: Image and count boxes */}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[20px] ">
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
            handleClick={handleLikes}
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
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none 
                border-[1px] border-[#3a3a43] bg-transparent font-epilogue 
                text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
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
        <div className="flex flex-col gap-[40px] w-full">
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
                    src={assets[ownerProfile.icon]}
                    alt="user"
                    className="h-auto max-w-full rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-epilogue font-semibold text-[14px] text-white ">
                    {ownerProfile.nickName}
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
          <div className="flex lg:flex-row flex-col justify-between gap-[10px]">
            <div className="bg-[#1c1c24] p-[20px] rounded-[10px] lg:w-[533px]">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Donators
              </h4>

              <div className="mt-[20px]  flex flex-col gap-4 overflow-auto h-[570px] overflow-x-hidden scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-600">
                {donators.length > 0 ? (
                  donators.map((item, index) => (
                    <DonatorCard key={index} item={item} />
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
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase mb-[20px]">
                Comments
              </h4>
              <SearchBar
                placeholder="Add a comment..."
                icon={assets.send}
                style="bg-[#13131a] max-w-full"
                handleSubmit={handleCommentSubmit}
              />
              <div className="mt-[20px] mb-[20px] flex flex-col gap-4 overflow-auto h-[500px] scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-600">
                {comments.length > 0 ? (
                  comments.map((item, index) => (
                    <CommentCard key={index} item={item} />
                  ))
                ) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                    No Comments yet. Be the first one!
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Polling and Updates */}
          <div className="flex lg:flex-row flex-col justify-between gap-[10px] ">
            {/* Polling */}
            <div className="lg:w-[400px]">
              {poll.options.length > 0 && (
                <div className="bg-[#1c1c24] p-[20px] rounded-[10px] min-h-[500px]">
                  <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                    Poll
                  </h4>
                  <div className="px-2 py-2  bg-[#28282e] rounded-[10px] h-[75px] overflow-auto scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-600">
                    <p className="font-epilogue font-semibold text-[15px] text-white ">
                      {poll.question}
                    </p>
                  </div>
                  <div className="mt-[20px] mb-[10px] flex flex-col gap-4 overflow-auto overflow-x-hidden h-[325px] scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-600">
                    {poll.options.map((item, index) => (
                      <PollingCard
                        key={index}
                        item={item}
                        pollSummary={pollSum}
                        handleOptionClick={handleOptionClick}
                        isDisabled={
                          isVoted.isVoted || connectionStatus !== "connected"
                        }
                        selectedOption={isVoted.optionId}
                      />
                    ))}
                  </div>
                </div>
              )}
              {state.isOwner && (
                <div className="bg-[#1c1c24] p-[20px] rounded-[10px] mt-[10px] min-h-[450px]">
                  <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase mb-[10px] ">
                    Create Poll
                  </h4>
                  <div>
                    <FormField
                      labelName="Poll Question *"
                      placeholder="Enter Poll Question"
                      inputType="text"
                      value={question}
                      handleChange={(e) => setQuestion(e.target.value)}
                    />
                    <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                      Options *
                    </span>
                    <div className="py-3 px-1 my-[10px] text-center bg-[#1c1c24] border-[#3a3a43] border-[1px] rounded-[10px] h-[60px] overflow-auto scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-600">
                      {options.length > 0 ? (
                        options.map((item, index) => (
                          <Pill
                            key={index}
                            index={index}
                            option={item}
                            handleDelete={deleteOption}
                          />
                        ))
                      ) : (
                        <Pill option={"No options yet..."} />
                      )}
                    </div>
                    <SearchBar
                      placeholder="Add polling option..."
                      icon={assets.plus}
                      style="bg-[#13131a] max-w-full"
                      handleSubmit={handleAddOption}
                    />
                    <CustomButton
                      btnType="button"
                      title={
                        <img
                          src={assets.check}
                          alt="close"
                          className="w-[30px] h-[30px] ml-auto mr-auto"
                        />
                      }
                      styles={"bg-[#1dc071] mt-[10px]  w-full mr-auto ml-auto"}
                      handleClick={handlePollSubmit}
                    />
                    <CustomButton
                      btnType="button"
                      title={
                        <img
                          src={assets.close}
                          alt="close"
                          className="w-[30px] h-[30px] ml-auto mr-auto"
                        />
                      }
                      styles={"bg-red-600 mt-[10px] w-full"}
                      handleClick={handlePollClear}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Prgress */}
            <div>
              {progress.length > 0 && (
                <div className="w-full min-h-[500px] bg-[#1c1c24] p-[20px] rounded-[10px] flex flex-col justify-evenly">
                  <div>
                    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                      Progress
                    </h4>
                    {/* <div className="mt-[20px] mb-[10px] flex flex-col gap-4 overflow-auto overflow-x-hidden h-[315px]"> */}
                    <div className="mt-[20px] mb-[10px] grid grid-flow-row  xl:grid-cols-2 gap-[10px] overflow-auto overflow-x-hidden h-[400px] scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-600">
                      {progress.length > 0 ? (
                        progress.map((item, index) => (
                          <ProgressCard key={index} item={item} />
                        ))
                      ) : (
                        <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                          No progress update yet...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {state.isOwner && (
                <div className="w-full min-h-[450px] bg-[#1c1c24] p-[20px] rounded-[10px] flex flex-col justify-evenly mt-[10px]">
                  <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase mb-[10px]">
                    Create Progress
                  </h4>
                  <FormField
                    labelName="Progress Title *"
                    placeholder="Enter Progress Title"
                    inputType="text"
                    value={currentProgress.progressTitle}
                    handleChange={(e) =>
                      handleProgressFormChange("progressTitle", e)
                    }
                  />
                  <FormField
                    labelName="Progress Description *"
                    placeholder="Enter Progress Description"
                    inputType="text"
                    value={currentProgress.description}
                    isTextArea={true}
                    rows={5}
                    handleChange={(e) =>
                      handleProgressFormChange("description", e)
                    }
                  />
                  <CustomButton
                    btnType="button"
                    title={
                      <img
                        src={assets.check}
                        alt="close"
                        className="w-[30px] h-[30px] ml-auto mr-auto"
                      />
                    }
                    styles={
                      "bg-[#1dc071] mt-[10px] lg:w-[300px] w-full mr-auto ml-auto"
                    }
                    handleClick={handleProgressSubmit}
                  />
                </div>
              )}
            </div>
          </div>
          {state.isOwner && (
            <div className="flex flex-col justify-center items-center bg-[#1c1c24] p-[10px] rounded-[10px]">
              {/* Graph */}
              <div className="px-2 py-5 bg-[#28282e] rounded-[10px] my-3">
                <p className="font-epilogue font-semibold text-[15px] text-white text-center">
                  {poll.question}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row">
                <CustomButton
                  btnType="button"
                  title="Bar Chart"
                  styles={`w-full  m-[10px] ${
                    graphType === "barChart" ? "bg-[#1dc071]" : "bg-[#8c6dfd]"
                  }`}
                  handleClick={() => setGraphType("barChart")}
                />
                <CustomButton
                  btnType="button"
                  title="Pie Chart"
                  styles={`w-full  m-[10px] ${
                    graphType === "pieChart" ? "bg-[#1dc071]" : "bg-[#8c6dfd]"
                  }`}
                  handleClick={() => setGraphType("pieChart")}
                />
                <CustomButton
                  btnType="button"
                  title="Doughnut Chart"
                  styles={`w-full m-[10px] ${
                    graphType === "doughnutChart"
                      ? "bg-[#1dc071]"
                      : "bg-[#8c6dfd]"
                  }`}
                  handleClick={() => setGraphType("doughnutChart")}
                />
              </div>
              {graphType === "pieChart" && (
                <PieChart poll={poll} style={"max-w-[500px] max-h-[500px]"} />
              )}
              {graphType === "barChart" && (
                <BarChart poll={poll} style={"max-w-[500px] max-h-[500px]"} />
              )}
              {graphType === "doughnutChart" && (
                <DoughnutChart
                  poll={poll}
                  style={"max-w-[500px] max-h-[500px]"}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

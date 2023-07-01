import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import Swal from "sweetalert2";

import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";
import { useConnectionStatus } from "@thirdweb-dev/react";

const CreateCampaign = () => {
  const BASE_URL = import.meta.env.VITE_BASEURL;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, getIndex, address } = useStateContext();
  const connectionStatus = useConnectionStatus();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleFormFieldChange = (fieldName, e) => {
    // if (fieldName === "deadline") {

    // }
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(connectionStatus);
    if (connectionStatus !== "connected") {
      Toast.fire({
        icon: "warning",
        title: "Connect to wallet before creating campaign",
      });
      return;
    }

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        const index = (await getIndex()).toString();
        await handleCreateCampaign(index);
        setIsLoading(false);
        navigate("/");
      } else {
        Toast.fire({
          icon: "warning",
          title: "Enter valid URL for image",
        });
        setForm({ ...form, image: "" });
      }
    });
  };

  const handleCreateCampaign = async (index) => {
    axios
      .post(`${BASE_URL}/create-campaign`, {
        campaignAddr: index,
        publicAddr: address,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      {/* Heading text and box */}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        {/* Inputs that are side by side */}
        <div className="flex flex-wrap gap-[40px]">
          {/* Name */}
          <FormField
            labelName="Your Name *"
            placeholder="Enter your name"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          {/* Title */}
          <FormField
            labelName="Campaign Title *"
            placeholder="Enter a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>
        {/* Story */}
        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />
        {/* Banner */}
        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>
        {/* Eth amount */}
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          {/* End date */}
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            currentDate={new Date().toISOString().split("T")[0]}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>
        {/* Image link */}
        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          {/* Submit button */}
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;

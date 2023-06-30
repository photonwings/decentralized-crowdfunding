import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { CustomButton, FormField, ImageIcon } from "../components";
import { profileImages } from "../utils";
import * as assets from "../assets";
import { useStateContext } from "../context";
const Register = () => {
  const [nickName, setNickname] = useState("");
  const [profileIcon, setProfileIcon] = useState("");
  const { address } = useStateContext();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASEURL;

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

  const getProfileIcon = (name) => {
    setProfileIcon(name);
  };
  const submitNickName = async () => {
    if (nickName === "") {
      Toast.fire({
        icon: "warning",
        title: "Please enter nick name",
      });
      return;
    }
    if (profileIcon === "") {
      Toast.fire({
        icon: "warning",
        title: "Please select profile icon",
      });
      return;
    }
    axios
      .post(`${BASE_URL}/create-user`, {
        publicAddr: address,
        nickName: nickName,
        icon: profileIcon,
      })
      .then((response) => {
        console.log(response);
        setNickname("");
        setProfileIcon("");
        window.location.href = "/";
        // navigate("/");
      })
      .catch((error) => console.log("Error while creating user: ", error));
  };
  return (
    <div className="flex justify-center vertical">
      <div className="bg-[#1c1c24] w-[500px]  p-[20px] rounded-[30px]">
        <h1 className="font-epilogue font-semibold text-[20px] text-white uppercase mb-[10px] text-center">
          Create Your Profile
        </h1>
        <FormField
          labelName="Nick Name *"
          placeholder="Enter Nick Name"
          inputType="text"
          value={nickName}
          handleChange={(e) => setNickname(e.target.value)}
        />
        <div className="flex flex-wrap m-2 justify-center gap-2">
          {profileImages.map((profileImage, index) => (
            <div key={index} className="sm:w-1/4 md:w-1/4 lg:w-1/6 m-1">
              <ImageIcon
                profileImage={profileImage}
                getProfileIcon={getProfileIcon}
                selectedProfile={profileIcon}
              />
            </div>
          ))}
        </div>
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
          handleClick={submitNickName}
        />
      </div>
    </div>
  );
};

export default Register;

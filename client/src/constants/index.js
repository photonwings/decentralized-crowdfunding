import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  userPen,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "Dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Create Campaign",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  // {
  //   name: 'payment',
  //   imgUrl: payment,
  //   link: '/',
  //   disabled: true,
  // },
  // {
  //   name: 'withdraw',
  //   imgUrl: withdraw,
  //   link: '/',
  //   disabled: true,
  // },
  {
    name: "Profile",
    imgUrl: profile,
    link: "/profile",
  },
  // {
  //   name: "Edit Profile",
  //   imgUrl: userPen,
  //   link: "/register",
  //   disabled: false,
  // },
];

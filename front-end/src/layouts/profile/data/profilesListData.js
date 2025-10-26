/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Images
import likith from "assets/profile-pictures/likith.png";
import marie from "assets/images/marie.jpg";
import pvn from "assets/profile-pictures/doge.jpeg";
import Pushkara from "assets/profile-pictures/pushkar.jpeg";

export default [
  {
    image: likith,
    name: "Likith Kumar V",
    description: "CFO/ Co-founder",
    action: {
      type: "internal",
      route: "/pages/profile/profile-overview",
      color: "info",
    },
  },
  {
    image: pvn,
    name: "Pavan Kumar",
    description: "COO/ Co-founder",
    action: {
      type: "internal",
      route: "/pages/profile/profile-overview",
      color: "info",
    },
  },
  {
    image: marie,
    name: "Tejaswini",
    description: "Angel Investor",
    action: {
      type: "internal",
      route: "/pages/profile/profile-overview",
      color: "info",
    },
  },
  {
    image: Pushkara,
    name: "Pushkara",
    description: "CMO/ Co-founder",
    action: {
      type: "internal",
      route: "/pages/profile/profile-overview",
      color: "info",
    },
  },
];
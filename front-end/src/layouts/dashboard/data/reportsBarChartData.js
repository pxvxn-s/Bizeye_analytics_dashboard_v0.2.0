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

// Sales Performance Comparison - Professional Analytics Chart Data
// TODO: Fetch product performance data from backend and map to labels/data
export default {
  labels: ["Historical Average", "Recent Sales (Last 7 Days)"],
  datasets: [
    {
      label: "Average Sales Units",
      data: [97, 100],
      backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 165, 0, 0.8)"], // Blue and Orange
      borderColor: ["rgb(54, 162, 235)", "rgb(255, 165, 0)"],
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
};

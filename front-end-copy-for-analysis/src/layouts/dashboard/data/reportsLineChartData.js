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

// Sales Performance Over Time - Professional Analytics Chart Data
// TODO: Fetch sales from backend; set accurate labels (dates) and datasets.
export default {
  sales: {
    labels: ["Jun 15 2025", "Jun 29", "Jul 13", "Jul 27", "Aug 10", "Aug 24"],
    datasets: [
      {
        label: "Historical Sales",
        data: [160, 45, 120, 60, 140, 90],
        borderColor: "rgb(54, 162, 235)", // Blue
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
      {
        label: "Recent Sales (Last 7 Days)",
        data: [null, null, null, null, 80, 120],
        borderColor: "rgb(34, 197, 94)", // Green
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  },
  tasks: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: {
      label: "Lifetime sales",
      data: [320, 340, 410, 460, 520, 560, 610, 640, 700, 760, 820, 900],
    },
  },
};

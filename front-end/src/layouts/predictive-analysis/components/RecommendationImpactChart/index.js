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

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Chart components
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function RecommendationImpactChart({ data, selectedCategory }) {

  // Chart data showing recommendation impact on sales
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Current Performance",
        data: data.currentPerformance,
        backgroundColor: "rgba(156, 39, 176, 0.1)",
        borderColor: "rgb(156, 39, 176)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(156, 39, 176)",
        pointBorderColor: "rgb(156, 39, 176)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "With Recommendations",
        data: data.recommendedPerformance,
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderColor: "rgb(76, 175, 80)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(76, 175, 80)",
        pointBorderColor: "rgb(76, 175, 80)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <MDBox mb={3}>
      <ReportsLineChart
        color="warning"
        title="Recommendation Impact Analysis"
        description={`${selectedCategory === "all" ? "All Categories" : `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`} - Current vs recommended performance trends`}
        date="AI recommendation analysis"
        chart={chartData}
      />
    </MDBox>
  );
}

// Setting default values for the props of RecommendationImpactChart
RecommendationImpactChart.defaultProps = {
  selectedCategory: "all",
};

// Typechecking props for the RecommendationImpactChart
RecommendationImpactChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    currentPerformance: PropTypes.array.isRequired,
    recommendedPerformance: PropTypes.array.isRequired,
  }).isRequired,
  selectedCategory: PropTypes.string,
};

export default RecommendationImpactChart;

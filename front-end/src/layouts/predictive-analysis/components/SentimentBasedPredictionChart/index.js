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

function SentimentBasedPredictionChart({ data, selectedCategory }) {

  // Chart data showing sentiment correlation with sales prediction
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Sentiment Score",
        data: data.sentimentScores,
        borderColor: "rgb(76, 175, 80)",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
        yAxisID: 'y',
      },
      {
        label: "Predicted Sales",
        data: data.predictedSales,
        borderColor: "rgb(33, 150, 243)",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        tension: 0.4,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
        borderDash: [8, 4],
        yAxisID: 'y1',
      },
    ],
  };

  return (
    <MDBox mb={3}>
      <ReportsLineChart
        color="info"
        title="Sentiment-Based Sales Prediction"
        description={`${selectedCategory === "all" ? "All Categories" : `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`} - Sentiment correlation with sales forecast`}
        date="AI-powered prediction analysis"
        chart={chartData}
      />
    </MDBox>
  );
}

// Setting default values for the props of SentimentBasedPredictionChart
SentimentBasedPredictionChart.defaultProps = {
  selectedCategory: "all",
};

// Typechecking props for the SentimentBasedPredictionChart
SentimentBasedPredictionChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    sentimentScores: PropTypes.array.isRequired,
    predictedSales: PropTypes.array.isRequired,
  }).isRequired,
  selectedCategory: PropTypes.string,
};

export default SentimentBasedPredictionChart;

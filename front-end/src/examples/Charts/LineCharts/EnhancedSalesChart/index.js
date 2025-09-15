/**
=========================================================
* Enhanced Sales Performance Chart - Professional Analytics
=========================================================
*/

import { useMemo } from "react";
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function EnhancedSalesChart({ color, title, description, date, chart, quarterlyData }) {
  const { data, options } = useMemo(() => {
    if (!chart || !chart.labels || !chart.datasets) {
      return { data: {}, options: {} };
    }

    // Limit X-axis to show only recent data points (last 7-10 points)
    const maxPoints = 8;
    const labels = chart.labels.slice(-maxPoints);
    const chartData = Array.isArray(chart.datasets)
      ? chart.datasets[0]?.data?.slice(-maxPoints) || []
      : chart.datasets?.data?.slice(-maxPoints) || [];

    const data = {
      labels: labels,
      datasets: [
        {
          label: chart.datasets?.label || "Sales Revenue (₹)",
          data: chartData,
          borderColor: "rgb(54, 162, 235)", // Blue (original)
          backgroundColor: "rgba(54, 162, 235, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "white",
          pointBorderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 6,
            font: {
              size: 11,
            },
          },
        },
        y: {
          display: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            callback: function (value) {
              return `₹${value.toLocaleString()}`;
            },
            font: {
              size: 11,
            },
            stepSize: 2000,
            maxTicksLimit: 8,
          },
          min: 0,
          max: chartData.length > 0 ? Math.max(...chartData) * 1.2 : 10000, // 20% above max value for better range
        },
      },
      animation: {
        duration: 1500,
        easing: "easeInOutQuart",
      },
    };

    return { data, options };
  }, [chart]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox padding="1rem">
        <MDBox
          variant="gradient"
          bgColor={color}
          borderRadius="lg"
          coloredShadow={color}
          py={2}
          pr={0.5}
          mt={-5}
          height="35rem"
        >
          <Line data={data} options={options} redraw />
        </MDBox>

        <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDTypography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
          <Divider />

          {/* Quarterly Analysis Cards */}
          {quarterlyData && (
            <MDBox mt={2}>
              <MDTypography variant="subtitle2" fontWeight="bold" color="dark" mb={1}>
                📊 Quarterly Performance
              </MDTypography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      borderRadius: 1,
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    <MDTypography variant="caption" color="success" fontWeight="bold">
                      Q1-Q4 Sales
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="bold" color="dark">
                      ₹{quarterlyData.totalSales?.toLocaleString() || "0"}
                    </MDTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      backgroundColor:
                        quarterlyData.growthPercentage >= 0
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(244, 67, 54, 0.1)",
                      borderRadius: 1,
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    <MDTypography
                      variant="caption"
                      color={quarterlyData.growthPercentage >= 0 ? "success" : "error"}
                      fontWeight="bold"
                    >
                      Growth Rate
                    </MDTypography>
                    <MDTypography
                      variant="body2"
                      fontWeight="bold"
                      color={quarterlyData.growthPercentage >= 0 ? "success" : "error"}
                    >
                      {quarterlyData.growthPercentage >= 0 ? "+" : ""}
                      {quarterlyData.growthPercentage?.toFixed(1) || "0"}%
                    </MDTypography>
                  </Box>
                </Grid>
              </Grid>
            </MDBox>
          )}

          <MDBox display="flex" alignItems="center" mt={1}>
            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <Icon>schedule</Icon>
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="light">
              {date}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props
EnhancedSalesChart.defaultProps = {
  color: "success",
  description: "",
};

// Typechecking props
EnhancedSalesChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  quarterlyData: PropTypes.shape({
    totalSales: PropTypes.number,
    growthPercentage: PropTypes.number,
  }),
};

export default EnhancedSalesChart;

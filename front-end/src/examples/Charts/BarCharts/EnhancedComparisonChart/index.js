/**
=========================================================
* Enhanced Sales Comparison Chart - Professional Analytics
=========================================================
*/

import { useMemo } from "react";
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function EnhancedComparisonChart({ color, title, description, date, chart, quarterlyData }) {
  const { data, options } = useMemo(() => {
    if (!chart || !chart.labels || !chart.datasets) {
      return { data: {}, options: {} };
    }

    const data = {
      labels: chart.labels,
      datasets: chart.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: index === 0 ? "rgba(54, 162, 235, 0.8)" : "rgba(255, 165, 0, 0.8)",
        borderColor: index === 0 ? "rgb(54, 162, 235)" : "rgb(255, 165, 0)",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      })),
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
              return `${context.dataset.label}: ${context.parsed.y} units`;
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
            font: {
              size: 11,
            },
            stepSize: 20,
            maxTicksLimit: 8,
          },
          min: 0,
          max:
            chart.datasets && chart.datasets.length > 0
              ? Math.max(...chart.datasets.flatMap((d) => d.data)) * 1.3
              : 200, // 30% above max value for better range
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
          <Bar data={data} options={options} redraw />
        </MDBox>

        <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDTypography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
          <Divider />

          {/* Performance Metrics */}
          {quarterlyData && (
            <MDBox mt={2}>
              <MDTypography variant="subtitle2" fontWeight="bold" color="dark" mb={1}>
                📈 Performance Metrics
              </MDTypography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(54, 162, 235, 0.1)",
                      borderRadius: 1,
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    <MDTypography variant="caption" color="info" fontWeight="bold">
                      Avg Units
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="bold" color="dark">
                      {quarterlyData.averageUnits || "0"}
                    </MDTypography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 165, 0, 0.1)",
                      borderRadius: 1,
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    <MDTypography variant="caption" color="warning" fontWeight="bold">
                      Peak Sales
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="bold" color="dark">
                      {quarterlyData.peakSales || "0"}
                    </MDTypography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      backgroundColor:
                        quarterlyData.trend >= 0
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(244, 67, 54, 0.1)",
                      borderRadius: 1,
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    <MDTypography
                      variant="caption"
                      color={quarterlyData.trend >= 0 ? "success" : "error"}
                      fontWeight="bold"
                    >
                      Trend
                    </MDTypography>
                    <MDTypography
                      variant="body2"
                      fontWeight="bold"
                      color={quarterlyData.trend >= 0 ? "success" : "error"}
                    >
                      {quarterlyData.trend >= 0 ? "↗" : "↘"}
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
EnhancedComparisonChart.defaultProps = {
  color: "info",
  description: "",
};

// Typechecking props
EnhancedComparisonChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  quarterlyData: PropTypes.shape({
    averageUnits: PropTypes.number,
    peakSales: PropTypes.number,
    trend: PropTypes.number,
  }),
};

export default EnhancedComparisonChart;

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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Chart components
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function CategoryPerformanceChart({ data, category }) {
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  // TODO: Connect to prediction API here
  // This will be replaced with real API data
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Predicted Performance",
        data: data.values,
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(34, 197, 94)",
          "rgb(251, 146, 60)",
          "rgb(168, 85, 247)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Modern Header */}
        <MDBox
          p={3}
          sx={{
            borderBottom: "1px solid",
            borderColor: "grey.200",
            background: "linear-gradient(135deg, #1976d2 0%, #1976d2 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" fontWeight="bold" color="white" mb={0.5}>
                Category Performance Forecast
              </MDTypography>
              <MDTypography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                Predicted performance by category
              </MDTypography>
            </MDBox>
            <IconButton
              size="small"
              onClick={openMenu}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Icon>more_vert</Icon>
            </IconButton>
          </MDBox>
        </MDBox>

        {/* Chart Content */}
        <MDBox p={3} sx={{ height: 400 }}>
          <ReportsBarChart color="info" title="" description="" chart={chartData} />
        </MDBox>

        {/* Modern Footer */}
        <MDBox
          p={2}
          sx={{
            borderTop: "1px solid",
            borderColor: "grey.200",
            bgcolor: "grey.50",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "info.main",
                }}
              />
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Performance Score
              </MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ fontSize: 16, color: "text.secondary" }}>schedule</Icon>
              <MDTypography variant="caption" color="text">
                Updated 2 min ago
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </CardContent>

      {/* Menu */}
      <Menu
        id="chart-menu"
        anchorEl={menu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(menu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>
          <Icon sx={{ mr: 1 }}>download</Icon>
          Export Data
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          <Icon sx={{ mr: 1 }}>refresh</Icon>
          Refresh Prediction
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          <Icon sx={{ mr: 1 }}>settings</Icon>
          Chart Settings
        </MenuItem>
      </Menu>
    </Card>
  );
}

// Setting default values for the props of CategoryPerformanceChart
CategoryPerformanceChart.defaultProps = {
  category: "all",
};

// Typechecking props for the CategoryPerformanceChart
CategoryPerformanceChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
  }).isRequired,
  category: PropTypes.string,
};

export default CategoryPerformanceChart;

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

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import SentimentAnalysis from "layouts/dashboard/components/SentimentAnalysis";

// API Service
import apiService from "services/apiService";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [chartData, setChartData] = useState({
    lineChart: reportsLineChartData.sales,
    barChart: reportsBarChartData,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load existing data on component mount (if available)
  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load existing analysis data first
      await loadSalesAnalysis();

      setSnackbar({
        open: true,
        message: "Using existing dataset for analysis!",
        severity: "info",
      });
    } catch (err) {
      console.error("Error loading existing data:", err);

      // If no existing data, show message to import data
      setError("No data available. Please import a dataset to begin analysis.");
      // Use mock data as fallback for demonstration
      setChartData({
        lineChart: reportsLineChartData.sales,
        barChart: reportsBarChartData,
      });

      setSnackbar({
        open: true,
        message: "No data found. Please import a dataset to see real analysis.",
        severity: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSalesAnalysis = async () => {
    try {
      // Get sales analysis metrics
      const analysisResponse = await apiService.analyzeSales();

      if (analysisResponse.status === "success") {
        setSalesData(analysisResponse.metrics);
      }

      // Get chart data
      const chartResponse = await apiService.getSalesChartData();
      const comparisonResponse = await apiService.getSalesComparisonData();

      if (chartResponse.status === "success") {
        setChartData((prev) => ({
          ...prev,
          lineChart: chartResponse.chartData,
        }));
      }

      if (comparisonResponse.status === "success") {
        setChartData((prev) => ({
          ...prev,
          barChart: comparisonResponse.chartData,
        }));
      }
    } catch (err) {
      console.error("Error loading sales analysis:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="trending_up"
                title="Historical Average"
                count={salesData?.historical_avg?.toFixed(0) || "119"}
                percentage={{
                  color: "info",
                  amount: "units/day",
                  label: "90-day average",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="schedule"
                title="Recent Sales"
                count={salesData?.recent_sales?.toFixed(0) || "94"}
                percentage={{
                  color: salesData?.performance_change < 0 ? "error" : "success",
                  amount: `${salesData?.performance_change?.toFixed(1) || "-21.3"}%`,
                  label: "vs historical avg",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="analytics"
                title="Performance Change"
                count={`${salesData?.performance_change?.toFixed(1) || "-21.3"}%`}
                percentage={{
                  color: salesData?.performance_change < 0 ? "error" : "success",
                  amount: salesData?.performance_change < 0 ? "decline" : "growth",
                  label:
                    salesData?.performance_change < 0 ? "requires attention" : "positive trend",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="inventory"
                title="Total Records"
                count="180"
                percentage={{
                  color: "info",
                  amount: "2 products",
                  label: "90 days data",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="info"
                  title="Sales Performance Over Time"
                  description="Product sales trends over 90 days with historical comparison"
                  date="Jun 15, 2025 - Aug 24, 2025"
                  chart={chartData.lineChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="warning"
                  title="Sales Performance Comparison"
                  description="Historical vs Recent Sales Analysis"
                  date={`Change: ${salesData?.performance_change?.toFixed(1) || "-21.3"}%`}
                  chart={chartData.barChart}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SentimentAnalysis />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      <Footer />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Dashboard;

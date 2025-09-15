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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Predictive Analysis components
import SalesForecastChart from "./components/SalesForecastChart";
import CategoryPerformanceChart from "./components/CategoryPerformanceChart";
import RiskAnalysisTable from "./components/RiskAnalysisTable";
import AIInsightsCards from "./components/AIInsightsCards";
import FilterPanel from "./components/FilterPanel";

// Services and data
import { predictionService } from "./services/predictionService";
import { mockPredictionData } from "./data/mockData";
import apiService from "services/apiService";

function PredictiveAnalysis() {
  // State for filters and data
  const [timeRange, setTimeRange] = useState("6months");
  const [category, setCategory] = useState("all");
  const [predictionData, setPredictionData] = useState(mockPredictionData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load prediction data on component mount
  useEffect(() => {
    loadPredictionData();
  }, []);

  const loadPredictionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all prediction data from backend
      const [forecastResponse, categoryResponse, risksResponse, insightsResponse] =
        await Promise.all([
          apiService.getSalesForecast(),
          apiService.getCategoryPerformance(),
          apiService.getPredictedRisks(),
          apiService.getAIInsights(),
        ]);

      // Update prediction data with backend response
      const updatedData = {
        salesForecast:
          forecastResponse.status === "success"
            ? forecastResponse.forecastData
            : mockPredictionData.salesForecast,
        categoryPerformance:
          categoryResponse.status === "success"
            ? categoryResponse.chartData
            : mockPredictionData.categoryPerformance,
        risks: risksResponse.status === "success" ? risksResponse.risks : mockPredictionData.risks,
        insights:
          insightsResponse.status === "success"
            ? insightsResponse.insights
            : mockPredictionData.insights,
      };

      setPredictionData(updatedData);

      setSnackbar({
        open: true,
        message: "Prediction data loaded successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error loading prediction data:", err);
      setError("Failed to load prediction data. Using mock data instead.");

      setSnackbar({
        open: true,
        message: "Using mock data. Backend connection failed.",
        severity: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newTimeRange, newCategory) => {
    setTimeRange(newTimeRange);
    setCategory(newCategory);

    try {
      setLoading(true);

      // Reload data with new filters
      await loadPredictionData();

      console.log("Filter changed:", { timeRange: newTimeRange, category: newCategory });
    } catch (err) {
      console.error("Error updating filters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading && !predictionData) {
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

        {/* Header Section */}
        <MDBox mb={4}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <MDBox>
                <MDTypography variant="h3" fontWeight="bold" color="dark" mb={1}>
                  Predictive Analysis
                </MDTypography>
                <MDTypography variant="h6" color="text" fontWeight="regular">
                  AI-powered forecasting and risk assessment
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                <Chip
                  icon={<Icon>psychology</Icon>}
                  label="ML Model Active"
                  color="success"
                  variant="filled"
                  sx={{ fontWeight: "medium" }}
                />
                <Chip
                  icon={<Icon>schedule</Icon>}
                  label="Auto-refresh: 30min"
                  color="info"
                  variant="outlined"
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Filter Panel */}
        <FilterPanel
          timeRange={timeRange}
          category={category}
          onFilterChange={handleFilterChange}
        />

        {/* AI Insights Cards */}
        <AIInsightsCards data={predictionData.insights} />

        {/* Charts Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} lg={8}>
            <SalesForecastChart data={predictionData.salesForecast} timeRange={timeRange} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <CategoryPerformanceChart
              data={predictionData.categoryPerformance}
              category={category}
            />
          </Grid>
        </Grid>

        {/* Risk Analysis Table */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RiskAnalysisTable data={predictionData.risks} />
          </Grid>
        </Grid>
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

export default PredictiveAnalysis;

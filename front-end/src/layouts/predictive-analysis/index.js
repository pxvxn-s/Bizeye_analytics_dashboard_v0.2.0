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
import RecommendationSystem from "./components/RecommendationSystem";
import AIInsightsCards from "./components/AIInsightsCards";

// Services
import apiService from "services/apiService";

function PredictiveAnalysis() {
  // State for filters and data
  const [timeRange, setTimeRange] = useState("1month");
  const [category, setCategory] = useState("all");
  const [predictionData, setPredictionData] = useState({
    salesForecast: null,
    categoryPerformance: null,
    insights: []
  });
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load data on initial mount
  useEffect(() => {
    loadPredictionData();
  }, []);

  // Reload data when category changes
  useEffect(() => {
    if (category) {
      loadPredictionData();
    }
  }, [category]);

  const loadPredictionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load sales data and prediction data from backend
      const [salesResponse, forecastResponse, insightsResponse] =
        await Promise.all([
          apiService.getSalesChartData(category),
          apiService.getSalesForecastPrediction(30, category),
          apiService.getAIInsights(category),
        ]);

      // Update sales data
      if (salesResponse.status === "success") {
        setSalesData(salesResponse);
      }

      // Update prediction data with backend response
      const updatedData = {
        salesForecast:
          forecastResponse.status === "success"
            ? forecastResponse
            : null,
        categoryPerformance: null, // Will be generated from sales data
        insights:
          insightsResponse.status === "success"
            ? insightsResponse.insights
            : [],
      };

      setPredictionData(updatedData);

      setSnackbar({
        open: true,
        message: "Prediction data loaded successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error loading prediction data:", err);
      setError("Failed to load prediction data. Please upload a dataset first.");

      setSnackbar({
        open: true,
        message: "No dataset available. Please upload a dataset to see predictions.",
        severity: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationSelect = (recommendation) => {
    setSelectedRecommendations(prev => {
      const exists = prev.find(rec => rec.id === recommendation.id);
      if (exists) {
        return prev.filter(rec => rec.id !== recommendation.id);
      } else {
        return [...prev, recommendation];
      }
    });

    setSnackbar({
      open: true,
      message: `Recommendation "${recommendation.title}" ${selectedRecommendations.find(rec => rec.id === recommendation.id) ? 'removed from' : 'added to'} analysis`,
      severity: "info",
    });
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
          </Grid>
        </MDBox>

        {/* Time Range Display */}
        <MDBox mb={4}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            backgroundColor: "warning.main"
          }}>
            <CardContent sx={{ p: 3 }}>
              <MDBox display="flex" alignItems="center" justifyContent="center">
                <MDTypography variant="h5" fontWeight="bold" color="white">
                  Analysis Period: Last 1 Month
                </MDTypography>
                <Icon sx={{ color: "white", ml: 2, fontSize: 36 }}>trending_up</Icon>
              </MDBox>
            </CardContent>
          </Card>
        </MDBox>

        {/* AI Insights Cards */}
        <AIInsightsCards 
          data={predictionData.insights} 
          salesData={salesData} 
          forecastData={predictionData.salesForecast}
        />

        {/* Charts Section */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <SalesForecastChart 
                data={salesData}
                timeRange={timeRange}
                selectedCategory={category}
                salesData={salesData}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <CategoryPerformanceChart
                category={category}
                selectedRecommendations={selectedRecommendations}
                salesData={salesData}
                timeRange={timeRange}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* Recommendation System */}
        <MDBox mt={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RecommendationSystem 
                data={salesData}
                selectedCategory={category}
                onRecommendationSelect={handleRecommendationSelect}
              />
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

export default PredictiveAnalysis;

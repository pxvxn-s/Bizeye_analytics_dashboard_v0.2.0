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
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);
  const [chartData, setChartData] = useState({
    lineChart: {
      labels: [],
      datasets: {
        label: "Sales Revenue (₹)",
        data: [],
      },
    },
    barChart: {
      labels: [],
      datasets: [],
    },
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [datasetUploadTrigger, setDatasetUploadTrigger] = useState(0);

  // Load existing data on component mount (if available)
  useEffect(() => {
    loadExistingData();
  }, []);

  const loadCategories = async () => {
    try {
      console.log("Loading categories...");
      const categoriesResponse = await apiService.getSentimentCategories();
      console.log("Categories response:", categoriesResponse);
      if (categoriesResponse.status === "success") {
        console.log("Setting categories:", categoriesResponse.categories);
        setCategories(categoriesResponse.categories || []);
      } else {
        console.log("Categories response failed:", categoriesResponse);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadExistingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if there's existing data first
      console.log("Checking for existing data...");
      console.log("Making API call to getDataStatus...");

      const dataStatus = await apiService.getDataStatus();
      console.log("Data status response:", dataStatus);
      console.log("Data status type:", typeof dataStatus);
      console.log("Data status keys:", dataStatus ? Object.keys(dataStatus) : "null/undefined");

      if (dataStatus && dataStatus.data_status?.dataset_loaded) {
        console.log("✅ Dataset found, loading existing data...");
        // Load existing data in parallel for better performance
        await Promise.all([loadSalesAnalysis(), loadCategories()]);
        setSnackbar({
          open: true,
          message: "Dataset loaded successfully!",
          severity: "success",
        });
      } else {
        console.log("No dataset loaded, showing import message");
        // Only show error message if we're not in the middle of an upload
        if (datasetUploadTrigger === 0) {
          setError("No dataset available. Please import a dataset to begin analysis.");
        } else {
          console.log("Upload in progress, not showing error message");
        }
        setChartData({
          lineChart: {
            labels: [],
            datasets: {
              label: "Sales Revenue (₹)",
              data: [],
            },
          },
          barChart: {
            labels: [],
            datasets: [],
          },
        });
        setSnackbar({
          open: true,
          message: "No dataset found. Please import a dataset to see real analysis.",
          severity: "info",
        });
      }
    } catch (err) {
      console.error("Error loading existing data:", err);
      console.error("Error details:", err.message);
      console.error("Error stack:", err.stack);
      console.error("Error name:", err.name);
      console.error("Error type:", typeof err);

      // Only show error message if we're not in the middle of an upload
      if (datasetUploadTrigger === 0) {
        setError("Unable to connect to the server. Please check if the backend is running and try again.");
      } else {
        console.log("Upload in progress, not showing error message");
      }
      setChartData({
        lineChart: {
          labels: [],
          datasets: {
            label: "Sales Revenue (₹)",
            data: [],
          },
        },
        barChart: {
          labels: [],
          datasets: [],
        },
      });
      setSnackbar({
        open: true,
        message: "No dataset found. Please import a dataset to see real analysis.",
        severity: "info",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultDataset = async () => {
    try {
      // Load default dataset
      const response = await apiService.loadDefaultDataset();

      if (response.status === "success") {
        // Load sales analysis metrics
        await loadSalesAnalysis();
      }
    } catch (err) {
      console.error("Error loading default dataset:", err);
      throw err;
    }
  };

  const loadSalesAnalysis = async (category = selectedCategory) => {
    try {
      // Make all API calls in parallel for better performance
      const [analysisResponse, chartResponse, comparisonResponse] = await Promise.all([
        apiService.analyzeSales(category),
        apiService.getSalesChartData(category),
        apiService.getSalesComparisonData(7, category),
      ]);

      if (analysisResponse.status === "success") {
        setSalesData(analysisResponse.metrics);
      }

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

  const handleCategoryChange = async (event) => {
    const category = event.target.value;
    console.log("Dashboard category changed to:", category);
    setSelectedCategory(category);
    await loadSalesAnalysis(category);
  };

  const handleDatasetCleared = () => {
    // Reset sales data and charts to empty state
    setSalesData(null);
    setSelectedCategory("all");
    setChartData({
      lineChart: {
        labels: [],
        datasets: {
          label: "Sales Revenue (₹)",
          data: [],
        },
      },
      barChart: {
        labels: [],
        datasets: [],
      },
    });
    setError("Dataset cleared. Please import a new dataset to begin analysis.");
    setSnackbar({
      open: true,
      message: "Dataset cleared successfully. Please import a new dataset to see analysis.",
      severity: "info",
    });
  };

  const handleDatasetUploaded = async () => {           
    console.log("Dataset uploaded, refreshing dashboard data...");           
    setDatasetUploadTrigger((prev) => prev + 1);  

    // Clear any existing error messages          
    setError(null);

    // Reload sales analysis and categories with new data - wait for completion
    console.log("🔄 Loading sales analysis and categories...");
    try {
      await Promise.all([loadSalesAnalysis(), loadCategories()]);
      console.log("✅ Sales analysis and categories loaded successfully");
    } catch (error) {
      console.error("❌ Error loading sales analysis or categories:", error);
    }

    setSnackbar({
      open: true,
      message: "Dataset uploaded successfully! Analysis updated.",           
      severity: "success",                        
    });
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
      <DashboardNavbar onDatasetUploaded={handleDatasetUploaded} />
      <MDBox py={3}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Sales Performance Section Header */}
        <MDBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <MDTypography variant="h4" fontWeight="medium" color="dark">
                Sales Performance
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  displayEmpty
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    letterSpacing: "0.02857em",
                    padding: "8px 12px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "rgba(0, 0, 0, 0.87)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                    "& .MuiSelect-icon": {
                      color: "rgba(0, 0, 0, 0.54)",
                    },
                  }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => {
                    console.log("Rendering category:", category);
                    return (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </MDBox>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="trending_up"
                title="Sales Performance"
                count={`${salesData?.performance_change?.toFixed(1) || "0.0"}%`}
                percentage={{
                  color: salesData?.performance_change >= 0 ? "success" : "error",
                  amount: `${salesData?.performance_change >= 0 ? "+" : ""}${
                    salesData?.performance_change?.toFixed(1) || "0.0"
                  }%`,
                  label: "vs last 7 days",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="store"
                title="Total Revenue"
                count={`₹${salesData?.total_revenue?.toLocaleString() || "0"}`}
                percentage={{
                  color: "success",
                  amount: `${salesData?.total_units_sold || "0"}`,
                  label: "units sold",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="person"
                title="Customer Reviews"
                count={`${salesData?.total_reviews || "0"}`}
                percentage={{
                  color: "success",
                  amount: `${salesData?.positive_percentage?.toFixed(1) || "0.0"}%`,
                  label: "positive reviews",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="inventory"
                title="Total Products"
                count={`${salesData?.total_products || "0"}`}
                percentage={{
                  color: "info",
                  amount: `₹${salesData?.avg_unit_price?.toFixed(2) || "0.00"}`,
                  label: "avg unit price",
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
                  description="Daily revenue and units sold trends from your dataset"
                  date={`${salesData?.total_products || "0"} products analyzed`}
                  chart={chartData.lineChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="warning"
                  title="Sales Performance Comparison"
                  description="Recent vs Historical Performance Analysis"
                  date={`Change: ${salesData?.performance_change?.toFixed(1) || "0.0"}%`}
                  chart={chartData.barChart}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Quarterly Performance Section */}
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: "100%" }}>
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium" color="dark" mb={3}>
                    Quarterly Performance
                  </MDTypography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        sx={{
                          backgroundColor: "rgba(76, 175, 80, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(76, 175, 80, 0.2)",
                        }}
                      >
                        <MDTypography variant="h4" fontWeight="bold" color="success">
                          ₹
                          {salesData
                            ? chartData.lineChart?.quarterlyAnalysis?.totalSales?.toLocaleString() || "0"
                            : "0"}
                        </MDTypography>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Total Sales Revenue
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        sx={{
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(244, 67, 54, 0.2)",
                        }}
                      >
                        <MDTypography variant="h4" fontWeight="bold" color="error">
                          {salesData ? chartData.lineChart?.quarterlyAnalysis?.growthPercentage || "0" : "0"}%
                        </MDTypography>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Growth Rate
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                  <MDBox mt={2} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      {salesData?.total_products || "0"} products analyzed
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: "100%" }}>
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium" color="dark" mb={3}>
                    Performance Metrics
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        sx={{
                          backgroundColor: "rgba(33, 150, 243, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(33, 150, 243, 0.2)",
                        }}
                      >
                        <MDTypography variant="h5" fontWeight="bold" color="info">
                          {salesData ? chartData.barChart?.quarterlyMetrics?.averageUnits || "0" : "0"}
                        </MDTypography>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Avg Units/Day
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={4}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        sx={{
                          backgroundColor: "rgba(255, 152, 0, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(255, 152, 0, 0.2)",
                        }}
                      >
                        <MDTypography variant="h5" fontWeight="bold" color="warning">
                          {salesData ? chartData.barChart?.quarterlyMetrics?.peakSales || "0" : "0"}
                        </MDTypography>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Peak Sales
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={4}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        sx={{
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(244, 67, 54, 0.2)",
                        }}
                      >
                        <MDTypography
                          variant="h5"
                          fontWeight="bold"
                          color={salesData?.performance_change >= 0 ? "success" : "error"}
                        >
                          {salesData?.performance_change >= 0 ? "↗" : "↘"}
                        </MDTypography>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Trend
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                  <MDBox mt={2} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Change: {salesData?.performance_change?.toFixed(1) || "0.0"}%
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Add spacing below performance metrics */}
        <MDBox py={4} />

        {/* Product Reviews Section */}
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="medium" color="dark">
            Product Reviews
          </MDTypography>
        </MDBox>

        {/* Sentiment Analysis Cards */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="sentiment_very_satisfied"
                  title="Positive Reviews"
                  count={`${sentimentData?.positive_percentage?.toFixed(1) || "0"}%`}
                  percentage={{
                    color: "success",
                    amount: `${Math.round((sentimentData?.positive_percentage || 0) * (sentimentData?.total_reviews || 0) / 100)} reviews`,
                    label: "satisfied customers",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="info"
                  icon="sentiment_neutral"
                  title="Neutral Reviews"
                  count={`${sentimentData?.neutral_percentage?.toFixed(1) || "0"}%`}
                  percentage={{
                    color: "info",
                    amount: `${Math.round((sentimentData?.neutral_percentage || 0) * (sentimentData?.total_reviews || 0) / 100)} reviews`,
                    label: "neutral feedback",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="error"
                  icon="sentiment_very_dissatisfied"
                  title="Negative Reviews"
                  count={`${sentimentData?.negative_percentage?.toFixed(1) || "0"}%`}
                  percentage={{
                    color: "error",
                    amount: `${Math.round((sentimentData?.negative_percentage || 0) * (sentimentData?.total_reviews || 0) / 100)} reviews`,
                    label: "need attention",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="rate_review"
                  title="Total Reviews"
                  count={sentimentData?.total_reviews || "0"}
                  percentage={{
                    color: "primary",
                    amount: selectedCategory === "all" ? "all categories" : selectedCategory,
                    label: "analyzed",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Sentiment Analysis Pie Chart */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                <MDBox p={4} sx={{ backgroundColor: "#f8f9fa" }}>
                  <MDTypography variant="h5" fontWeight="bold" color="dark" mb={2} textAlign="center">
                    Customer Sentiment Overview
                  </MDTypography>
                  
                  {/* Category Information */}
                  <MDTypography variant="body1" color="text.secondary" mb={3} textAlign="center">
                    {selectedCategory === "all" ? "All Categories" : `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
                  </MDTypography>
                  
                  <Grid container spacing={1} alignItems="center">
                    {/* Left Side Content */}
                    <Grid item xs={12} md={3}>
                      <MDBox
                        sx={{
                          background: "white",
                          borderRadius: 3,
                          p: 3,
                          color: "dark",
                          textAlign: "center",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <MDTypography variant="h3" fontWeight="bold" mb={1} color="success.main">
                          {sentimentData?.positive_percentage?.toFixed(1) || "0"}%
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium" mb={2} color="dark">
                          Satisfied Customers
                        </MDTypography>
                        <MDTypography variant="body2" color="text.secondary">
                          Excellent product quality and outstanding customer service experience
                        </MDTypography>
                      </MDBox>
                    </Grid>

                    {/* Pie Chart */}
                    <Grid item xs={12} md={6}>
                      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="420px">
                        {sentimentData ? (
                          <MDBox
                            sx={{
                              width: 380,
                              height: 380,
                              borderRadius: "50%",
                              background: `conic-gradient(
                                #4caf50 0deg ${(sentimentData.positive_percentage || 0) * 3.6}deg,
                                #2196f3 ${(sentimentData.positive_percentage || 0) * 3.6}deg ${((sentimentData.positive_percentage || 0) + (sentimentData.neutral_percentage || 0)) * 3.6}deg,
                                #f44336 ${((sentimentData.positive_percentage || 0) + (sentimentData.neutral_percentage || 0)) * 3.6}deg 360deg
                              )`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                              border: "10px solid white",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: -5,
                                left: -5,
                                right: -5,
                                bottom: -5,
                                borderRadius: "50%",
                                background: "linear-gradient(45deg, #4caf50, #2196f3, #f44336)",
                                zIndex: -1,
                              }
                            }}
                          >
                            <MDBox
                              sx={{
                                width: 180,
                                height: 180,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                boxShadow: "inset 0 4px 20px rgba(0,0,0,0.1)",
                              }}
                            >
                              <MDTypography variant="h4" fontWeight="bold" color="dark">
                                {sentimentData.total_reviews || 0}
                              </MDTypography>
                              <MDTypography variant="body2" color="text.secondary" fontWeight="medium">
                                Total Reviews
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        ) : (
                          <MDBox
                            sx={{
                              width: 380,
                              height: 380,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                              border: "10px solid white",
                            }}
                          >
                            <MDBox
                              sx={{
                                width: 180,
                                height: 180,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                boxShadow: "inset 0 4px 20px rgba(0,0,0,0.1)",
                              }}
                            >
                              <MDTypography variant="h4" fontWeight="bold" color="text.secondary">
                                0
                              </MDTypography>
                              <MDTypography variant="body2" color="text.secondary" fontWeight="medium">
                                No Data Available
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        )}
                      </MDBox>
                    </Grid>

                    {/* Right Side Content */}
                    <Grid item xs={12} md={3}>
                      <MDBox
                        sx={{
                          background: "white",
                          borderRadius: 3,
                          p: 3,
                          color: "dark",
                          textAlign: "center",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <MDTypography variant="h3" fontWeight="bold" mb={1} color="error.main">
                          {sentimentData?.negative_percentage?.toFixed(1) || "0"}%
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium" mb={2} color="dark">
                          Areas for Improvement
                        </MDTypography>
                        <MDTypography variant="body2" color="text.secondary">
                          Customer feedback highlighting opportunities for enhancement
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>

                  {/* Enhanced Legend */}
                  {sentimentData && (
                    <MDBox mt={4} display="flex" justifyContent="center" gap={4} flexWrap="wrap">
                      <MDBox
                        sx={{
                          background: "white",
                          borderRadius: 2,
                          p: 2,
                          color: "dark",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 180,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <MDBox
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "#4caf50",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MDTypography variant="caption" color="white" fontWeight="bold">
                            ✓
                          </MDTypography>
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="body2" fontWeight="bold" color="dark">
                            Satisfied
                          </MDTypography>
                          <MDTypography variant="caption" color="text.secondary">
                            {sentimentData.positive_percentage?.toFixed(1)}% • {Math.round((sentimentData.positive_percentage || 0) * (sentimentData.total_reviews || 0) / 100)} reviews
                          </MDTypography>
                        </MDBox>
                      </MDBox>

                      <MDBox
                        sx={{
                          background: "white",
                          borderRadius: 2,
                          p: 2,
                          color: "dark",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 180,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <MDBox
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "#2196f3",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MDTypography variant="caption" color="white" fontWeight="bold">
                            ○
                          </MDTypography>
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="body2" fontWeight="bold" color="dark">
                            Neutral
                          </MDTypography>
                          <MDTypography variant="caption" color="text.secondary">
                            {sentimentData.neutral_percentage?.toFixed(1)}% • {Math.round((sentimentData.neutral_percentage || 0) * (sentimentData.total_reviews || 0) / 100)} reviews
                          </MDTypography>
                        </MDBox>
                      </MDBox>

                      <MDBox
                        sx={{
                          background: "white",
                          borderRadius: 2,
                          p: 2,
                          color: "dark",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 180,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <MDBox
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "#f44336",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MDTypography variant="caption" color="white" fontWeight="bold">
                            !
                          </MDTypography>
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="body2" fontWeight="bold" color="dark">
                            Needs Attention
                          </MDTypography>
                          <MDTypography variant="caption" color="text.secondary">
                            {sentimentData.negative_percentage?.toFixed(1)}% • {Math.round((sentimentData.negative_percentage || 0) * (sentimentData.total_reviews || 0) / 100)} reviews
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  )}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SentimentAnalysis 
                onDatasetCleared={handleDatasetCleared} 
                onDatasetUploaded={datasetUploadTrigger}
                selectedCategory={selectedCategory}
                categories={categories}
                onSentimentDataUpdate={setSentimentData}
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

export default Dashboard;

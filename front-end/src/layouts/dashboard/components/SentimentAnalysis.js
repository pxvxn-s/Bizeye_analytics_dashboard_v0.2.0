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

import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Chart.js components
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// API Service
import apiService from "services/apiService";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function SentimentAnalysis({ onDatasetCleared, onDatasetUploaded, selectedCategory }) {
  console.log("🔄 SentimentAnalysis component rendered with selectedCategory:", selectedCategory);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isUploading, setIsUploading] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Get available categories from reviews
  const availableCategories = ["all", ...new Set(reviews.map((review) => review.category).filter(Boolean))];

  // Sample data that matches the image
  const sampleReviews = [
    {
      id: "P001",
      productName: "iPhone 14 Pro",
      category: "Electronics",
      review: "A complete failure. I had to return it.",
      sentiment: "Negative",
    },
    {
      id: "P002",
      productName: "Dyson V11 Vacuum",
      category: "Home Appliances",
      review: "A terrible experience. The product is not as described.",
      sentiment: "Negative",
    },
    {
      id: "P003",
      productName: "Levi's 501 Jeans",
      category: "Clothing",
      review: "I regret buying this. It's of very low quality.",
      sentiment: "Positive",
    },
    {
      id: "P004",
      productName: "The Da Vinci Code",
      category: "Books",
      review: "Does not work as advertised. Extremely frustrating.",
      sentiment: "Negative",
    },
    {
      id: "P005",
      productName: "Neutrogena Skincare Set",
      category: "Beauty Products",
      review: "Absolutely fantastic! Exceeded all my expectations.",
      sentiment: "Positive",
    },
    {
      id: "P006",
      productName: "Nike Air Max 270",
      category: "Sports",
      review: "This product did not work at all. A complete waste of money.",
      sentiment: "Negative",
    },
    {
      id: "P007",
      productName: "Samsung Galaxy S22",
      category: "Electronics",
      review: "This product did not work at all. A complete waste of money.",
      sentiment: "Negative",
    },
    {
      id: "P008",
      productName: "Keurig K-Elite Coffee Maker",
      category: "Home Appliances",
      review: "Five stars! The best purchase I've made this year.",
      sentiment: "Positive",
    },
    {
      id: "P009",
      productName: "Adidas Ultraboost",
      category: "Clothing",
      review: "The quality is shocking. Avoid this product",
      sentiment: "Positive",
    },
    {
      id: "P010",
      productName: "MacBook Pro M2",
      category: "Electronics",
      review: "Outstanding performance and build quality. Worth every penny!",
      sentiment: "Positive",
    },
    {
      id: "P011",
      productName: "KitchenAid Mixer",
      category: "Home Appliances",
      review: "Poor quality control. Broke after just one month of use.",
      sentiment: "Negative",
    },
    {
      id: "P012",
      productName: "Nike Air Jordan 1",
      category: "Sports",
      review: "Comfortable and stylish. Great for daily wear.",
      sentiment: "Positive",
    },
    {
      id: "P013",
      productName: "Sony WH-1000XM4",
      category: "Electronics",
      review: "Terrible noise cancellation. Not worth the high price.",
      sentiment: "Negative",
    },
    {
      id: "P014",
      productName: "Instant Pot Duo",
      category: "Home Appliances",
      review: "Revolutionary cooking experience. Highly recommend!",
      sentiment: "Positive",
    },
    {
      id: "P015",
      productName: "Calvin Klein T-Shirt",
      category: "Clothing",
      review: "Fabric feels cheap and shrinks after first wash.",
      sentiment: "Negative",
    },
    {
      id: "P016",
      productName: "Dyson Airwrap",
      category: "Beauty Products",
      review: "Game changer for hair styling. Love the results!",
      sentiment: "Positive",
    },
    {
      id: "P017",
      productName: "Tesla Model 3",
      category: "Automotive",
      review: "Amazing electric vehicle with incredible range and features.",
      sentiment: "Positive",
    },
    {
      id: "P018",
      productName: "Peloton Bike",
      category: "Sports",
      review: "Overpriced and overhyped. Regular bike works just as well.",
      sentiment: "Negative",
    },
    {
      id: "P019",
      productName: "Apple Watch Series 8",
      category: "Electronics",
      review: "Excellent health tracking features and battery life.",
      sentiment: "Positive",
    },
    {
      id: "P020",
      productName: "Roomba i7+",
      category: "Home Appliances",
      review: "Constantly gets stuck and doesn't clean effectively.",
      sentiment: "Negative",
    },
  ];

  // Load sentiment data on component mount
  useEffect(() => {
    console.log("🔄 COMPONENT MOUNTED - Loading sentiment data");
    // Only load data on mount if we haven't loaded initial data yet
    if (!hasLoadedInitialData && !isUploading) {
      loadSentimentData();
      setHasLoadedInitialData(true);
    } else {
      console.log("Skipping mount load - already loaded initial data or currently uploading");
    }
  }, []);

  // Handle dataset clearing from parent component
  useEffect(() => {
    if (onDatasetCleared) {
      console.log("🧹 DATASET CLEARED - Clearing all data");
      setReviews([]);
      setFilteredReviews([]);
      setSentimentData(null);
      setError(null);
      setHasLoadedInitialData(false); // Reset the flag so we can load data again
    }
  }, [onDatasetCleared]);

  // Handle dataset upload from parent component
  useEffect(() => {
    if (onDatasetUploaded && onDatasetUploaded > 0) {
      console.log("📤 DATASET UPLOADED - Trigger:", onDatasetUploaded);
      console.log("Dataset uploaded, refreshing data...");
      setIsUploading(true);

      // Simple approach: wait 2 seconds then load data once
      setTimeout(() => {
        console.log("⏰ TIMEOUT COMPLETE - Loading sentiment data after 2 seconds");
        loadSentimentData();
        setIsUploading(false);
      }, 2000);
    }
  }, [onDatasetUploaded]);

  const loadSentimentData = async () => {
    console.log("=== LOAD SENTIMENT DATA CALLED ===");
    console.log("Current isUploading state:", isUploading);
    console.log("Current isLoadingData state:", isLoadingData);
    console.log("Current reviews count:", reviews.length);
    console.log("Current filteredReviews count:", filteredReviews.length);

    // Prevent multiple concurrent calls
    if (isLoadingData) {
      console.log("🚫 Already loading data, skipping this call");
      return;
    }

    setIsLoadingData(true);

    try {
      setLoading(true);
      setError(null);

      console.log("Loading sentiment data...");

      // Try to get reviews from API first
      try {
        const reviewsResponse = await apiService.getSentimentReviews(1, 1000);
        console.log("Reviews response:", reviewsResponse);

        if (reviewsResponse && reviewsResponse.reviews && reviewsResponse.reviews.length > 0) {
          // Normalize the data structure to ensure consistent field names
          const normalizedReviews = reviewsResponse.reviews.map((review, index) => ({
            id: review.product_id || review.id || `P${String(index + 1).padStart(3, "0")}`,
            productName: review.product_name || review.productName || review.product || "Unknown Product",
            category: review.category || review.product_category || "Unknown Category",
            review: review.review_text || review.review || review.text || "No review text",
            sentiment: review.sentiment || "Neutral",
          }));

          console.log("Normalized reviews:", normalizedReviews.length);
          console.log("Setting reviews and filteredReviews...");
          setReviews(normalizedReviews);
          setFilteredReviews(normalizedReviews);
          console.log("Reviews set successfully!");

          // Try to get sentiment analysis summary
          try {
            const analysisResponse = await apiService.analyzeSentiment();
            if (analysisResponse && analysisResponse.status === "success") {
              setSentimentData(analysisResponse.summary);
            }
          } catch (analysisError) {
            console.log("Sentiment analysis not available:", analysisError);
            setSentimentData(null);
          }
        } else {
          console.log("No reviews found in API response");

          // Don't clear data if we're currently uploading
          if (isUploading) {
            console.log("Currently uploading, keeping existing data");
            return;
          }

          // Be very conservative - only clear if we're absolutely sure there's no dataset
          // and we don't have any existing data
          if (reviews.length === 0) {
            try {
              const dataStatusResponse = await apiService.getDataStatus();
              console.log("Data status response:", dataStatusResponse);
              if (!dataStatusResponse || !dataStatusResponse.data_status?.dataset_loaded) {
                console.log("🚨 CONFIRMED: No dataset available and no existing data, clearing reviews");
                setReviews([]);
                setFilteredReviews([]);
                setSentimentData(null);
              } else {
                console.log("Dataset exists but no reviews yet, keeping current data");
              }
            } catch (statusError) {
              console.log("Could not check data status:", statusError);
              console.log("Keeping existing data due to status check error");
            }
          } else {
            console.log("Have existing reviews, not clearing data");
          }
        }
      } catch (apiError) {
        console.log("API error:", apiError);

        // Don't clear data if we're currently uploading
        if (isUploading) {
          console.log("Currently uploading, keeping existing data despite API error");
          return;
        }

        // Be very conservative - only clear if we're absolutely sure there's no dataset
        // and we don't have any existing data
        if (reviews.length === 0) {
          try {
            const dataStatusResponse = await apiService.getDataStatus();
            console.log("Data status response (API error):", dataStatusResponse);
            if (!dataStatusResponse || !dataStatusResponse.data_status?.dataset_loaded) {
              console.log("🚨 CONFIRMED: No dataset available and no existing data, clearing reviews (API error)");
              setReviews([]);
              setFilteredReviews([]);
              setSentimentData(null);
            } else {
              console.log("Dataset exists but API error, keeping current data");
            }
          } catch (statusError) {
            console.log("Could not check data status:", statusError);
            console.log("Keeping existing data due to status check error");
          }
        } else {
          console.log("Have existing reviews, not clearing data despite API error");
        }
      }
    } catch (err) {
      console.error("Error loading sentiment data:", err);
      setError("Failed to load sentiment data.");
      if (!isUploading) {
        setReviews([]);
        setFilteredReviews([]);
        setSentimentData(null);
      }
    } finally {
      setLoading(false);
      setIsLoadingData(false);
      console.log("✅ Load sentiment data completed");
    }
  };

  const handleRefresh = () => {
    loadSentimentData();
  };

  // Filter and sort reviews
  useEffect(() => {
    console.log("🔄 Filtering reviews - selectedCategory:", selectedCategory);
    console.log("🔄 Total reviews before filtering:", reviews.length);
    console.log("🔄 Sample review categories:", reviews.slice(0, 5).map(r => r.category));
    
    let filtered = [...reviews];

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      console.log("🔄 Filtering by category:", selectedCategory);
      filtered = filtered.filter((review) => {
        const matches = review.category?.toLowerCase() === selectedCategory.toLowerCase();
        console.log(`🔄 Review ${review.id} category "${review.category}" matches "${selectedCategory}":`, matches);
        return matches;
      });
      console.log("🔄 Reviews after category filtering:", filtered.length);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.review?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    console.log("🔄 Final filtered reviews count:", filtered.length);
    setFilteredReviews(filtered);
  }, [reviews, selectedCategory, searchTerm, sortField, sortDirection]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      case "neutral":
        return "info";
      default:
        return "default";
    }
  };

  // Calculate sentiment metrics for cards
  const calculateSentimentMetrics = () => {
    // Use filteredReviews directly since useMemo will handle the updates
    if (!filteredReviews || filteredReviews.length === 0) {
      return {
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        positivePercentage: 0,
        negativePercentage: 0,
        neutralPercentage: 0,
      };
    }

    const total = filteredReviews.length;
    const positive = filteredReviews.filter((review) => review.sentiment?.toLowerCase() === "positive").length;
    const negative = filteredReviews.filter((review) => review.sentiment?.toLowerCase() === "negative").length;
    const neutral = filteredReviews.filter((review) => review.sentiment?.toLowerCase() === "neutral").length;

    return {
      total,
      positive,
      negative,
      neutral,
      positivePercentage: total > 0 ? ((positive / total) * 100).toFixed(1) : 0,
      negativePercentage: total > 0 ? ((negative / total) * 100).toFixed(1) : 0,
      neutralPercentage: total > 0 ? ((neutral / total) * 100).toFixed(1) : 0,
    };
  };

  const calculatePieChartData = () => {
    const colors = {
      positive: "#4CAF50", // Bright Green
      neutral: "#2196F3", // Bright Blue
      negative: "#F44336", // Bright Red
    };

    if (!filteredReviews || filteredReviews.length === 0) {
      return {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            label: "Sentiment Analysis",
            data: [0, 0, 0],
            backgroundColor: [colors.positive, colors.neutral, colors.negative],
            borderColor: [colors.positive, colors.neutral, colors.negative],
            borderWidth: 3,
          },
        ],
      };
    }

    const total = filteredReviews.length;
    const positive = filteredReviews.filter((review) => review.sentiment?.toLowerCase() === "positive").length;
    const negative = filteredReviews.filter((review) => review.sentiment?.toLowerCase() === "negative").length;
    const neutral = filteredReviews.filter((review) => review.sentiment?.toLowerCase() === "neutral").length;

    return {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          label: "Sentiment Analysis",
          data: [positive, neutral, negative],
          backgroundColor: [colors.positive, colors.neutral, colors.negative],
          borderColor: [colors.positive, colors.neutral, colors.negative],
          borderWidth: 3,
        },
      ],
    };
  };

  // Use useMemo to recalculate metrics when filteredReviews or selectedCategory changes
  const sentimentMetrics = useMemo(() => {
    console.log("🔄 Recalculating sentiment metrics for category:", selectedCategory);
    return calculateSentimentMetrics();
  }, [filteredReviews, selectedCategory]);

  const pieChartData = useMemo(() => {
    console.log("🔄 Recalculating pie chart data for category:", selectedCategory);
    return calculatePieChartData();
  }, [filteredReviews, selectedCategory]);

  return (
    <MDBox>
      {/* Product Reviews Heading */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDTypography variant="h4" fontWeight="bold" color="dark">
          Product Reviews
        </MDTypography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{
            backgroundColor: "#1976d2",
            color: "white !important",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1565c0",
              color: "white !important",
            },
          }}
        >
          REFRESH DATA
        </Button>
      </MDBox>

      {/* Sentiment Analysis Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="sentiment_very_satisfied"
              title="Positive Reviews"
              count={`${sentimentMetrics.positivePercentage}%`}
              percentage={{
                color: "success",
                amount: `${sentimentMetrics.positive} reviews`,
                label: "customer satisfaction",
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
              count={`${sentimentMetrics.neutralPercentage}%`}
              percentage={{
                color: "info",
                amount: `${sentimentMetrics.neutral} reviews`,
                label: "mixed feedback",
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
              count={`${sentimentMetrics.negativePercentage}%`}
              percentage={{
                color: "error",
                amount: `${sentimentMetrics.negative} reviews`,
                label: "needs attention",
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="primary"
              icon="analytics"
              title="Total Reviews"
              count={sentimentMetrics.total}
              percentage={{
                color: "info",
                amount: "analyzed",
                label: "customer feedback",
              }}
            />
          </MDBox>
        </Grid>
      </Grid>

      {/* Sentiment Analysis Pie Chart */}
      <Card sx={{ mb: 3 }}>
        <MDBox p={3}>
          <MDBox display="flex" alignItems="center" lineHeight={0} mb={3}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
                mr: 1,
              }}
            >
              pie_chart
            </Icon>
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Sentiment Distribution
            </MDTypography>
          </MDBox>

          <Grid container spacing={3}>
            {/* Left Side Content */}
            <Grid item xs={12} md={3}>
              <MDBox>
                <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                  Analysis Insights
                </MDTypography>
                <MDBox mb={2}>
                  <MDTypography variant="body2" color="text" mb={1}>
                    <strong>Customer Satisfaction:</strong>
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {pieChartData.datasets[0].data[0] > 0
                      ? `${((pieChartData.datasets[0].data[0] / filteredReviews.length) * 100).toFixed(
                          1
                        )}% of customers are satisfied`
                      : "No positive feedback available"}
                  </MDTypography>
                </MDBox>
                <MDBox mb={2}>
                  <MDTypography variant="body2" color="text" mb={1}>
                    <strong>Areas for Improvement:</strong>
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {pieChartData.datasets[0].data[2] > 0
                      ? `${((pieChartData.datasets[0].data[2] / filteredReviews.length) * 100).toFixed(
                          1
                        )}% need attention`
                      : "No negative feedback"}
                  </MDTypography>
                </MDBox>
                <MDBox>
                  <MDTypography variant="body2" color="text" mb={1}>
                    <strong>Overall Sentiment:</strong>
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {pieChartData.datasets[0].data[0] > pieChartData.datasets[0].data[2]
                      ? "Generally Positive"
                      : pieChartData.datasets[0].data[2] > pieChartData.datasets[0].data[0]
                      ? "Needs Improvement"
                      : "Mixed Feedback"}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>

            {/* Center Pie Chart */}
            <Grid item xs={12} md={6}>
              <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                          color: "#333",
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "#ddd",
                        borderWidth: 1,
                        callbacks: {
                          label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${context.parsed} reviews (${percentage}%)`;
                          },
                        },
                      },
                    },
                    elements: {
                      arc: {
                        borderWidth: 3,
                        borderColor: "#fff",
                      },
                    },
                  }}
                />
              </MDBox>
            </Grid>

            {/* Right Side Content */}
            <Grid item xs={12} md={3}>
              <MDBox>
                <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                  Category Breakdown
                </MDTypography>
                <MDBox mb={2}>
                  <MDTypography variant="body2" color="text" mb={1}>
                    <strong>Current Filter:</strong>
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </MDTypography>
                </MDBox>
                <MDBox mb={2}>
                  <MDTypography variant="body2" color="text" mb={1}>
                    <strong>Total Reviews:</strong>
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {filteredReviews.length} reviews analyzed
                  </MDTypography>
                </MDBox>
                <MDBox mb={2}>
                  <MDTypography variant="body2" color="text" mb={1}>
                    <strong>Data Quality:</strong>
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {filteredReviews.length > 0 ? "High" : "No data available"}
                  </MDTypography>
                </MDBox>
                <MDBox>
                  <MDTypography variant="body2" color="text" mb={1}>
                    <strong>Recommendation:</strong>
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {pieChartData.datasets[0].data[0] > pieChartData.datasets[0].data[2]
                      ? "Continue current strategy"
                      : "Focus on customer satisfaction"}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>

      {/* Product Reviews Analysis Table */}
      <Card>
        <MDBox p={3}>
          {/* Product Reviews Analysis Section */}
          <MDBox mb={3}>
            <MDTypography variant="h5" fontWeight="bold" color="dark" mb={2}>
              Product Reviews Analysis
            </MDTypography>
          </MDBox>

          {/* Search Controls */}
          <MDBox display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
            <TextField
              size="small"
              placeholder="Search products, reviews, or categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                ),
              }}
            />

            <MDTypography variant="body2" color="text">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </MDTypography>
          </MDBox>

          {loading ? (
            <MDBox display="flex" justifyContent="center" p={3}>
              <CircularProgress size={40} />
            </MDBox>
          ) : error ? (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : filteredReviews.length === 0 ? (
            <Box
              sx={{
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                backgroundColor: "white",
                padding: 4,
                textAlign: "center",
              }}
            >
              <MDTypography variant="h6" color="text" mb={2}>
                No Data Available
              </MDTypography>
              <MDTypography variant="body2" color="text" mb={3}>
                Please import a dataset to view sentiment analysis results.
              </MDTypography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white !important",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    color: "white !important",
                  },
                }}
              >
                REFRESH DATA
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                backgroundColor: "white",
                overflow: "hidden",
              }}
            >
              {/* Fixed Header Row */}
              <Box
                sx={{
                  display: "flex",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "2px solid #e0e0e0",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <Box
                  sx={{
                    flex: "0 0 120px",
                    padding: "12px 16px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { backgroundColor: "#e9ecef" },
                  }}
                  onClick={() => handleSort("id")}
                >
                  Product ID
                  {sortField === "id" && (
                    <Icon sx={{ ml: 1, fontSize: "1rem" }}>
                      {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                    </Icon>
                  )}
                </Box>
                <Box
                  sx={{
                    flex: "0 0 200px",
                    padding: "12px 16px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { backgroundColor: "#e9ecef" },
                  }}
                  onClick={() => handleSort("productName")}
                >
                  Product Name
                  {sortField === "productName" && (
                    <Icon sx={{ ml: 1, fontSize: "1rem" }}>
                      {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                    </Icon>
                  )}
                </Box>
                <Box
                  sx={{
                    flex: "0 0 150px",
                    padding: "12px 16px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { backgroundColor: "#e9ecef" },
                  }}
                  onClick={() => handleSort("category")}
                >
                  Category
                  {sortField === "category" && (
                    <Icon sx={{ ml: 1, fontSize: "1rem" }}>
                      {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                    </Icon>
                  )}
                </Box>
                <Box
                  sx={{
                    flex: "1 1 auto",
                    padding: "12px 16px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    minWidth: "300px",
                  }}
                >
                  Review
                </Box>
                <Box
                  sx={{
                    flex: "0 0 120px",
                    padding: "12px 16px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { backgroundColor: "#e9ecef" },
                  }}
                  onClick={() => handleSort("sentiment")}
                >
                  Sentiment
                  {sortField === "sentiment" && (
                    <Icon sx={{ ml: 1, fontSize: "1rem" }}>
                      {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                    </Icon>
                  )}
                </Box>
              </Box>

              {/* Scrollable Data Rows */}
              <Box
                sx={{
                  maxHeight: 500,
                  overflow: "auto",
                }}
              >
                {filteredReviews.map((review, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      borderBottom: "1px solid #f0f0f0",
                      "&:hover": { backgroundColor: "#f8f9fa" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <Box
                      sx={{
                        flex: "0 0 120px",
                        padding: "12px 16px",
                        fontWeight: "medium",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {review.id}
                    </Box>
                    <Box
                      sx={{
                        flex: "0 0 200px",
                        padding: "12px 16px",
                        fontWeight: "medium",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {review.productName}
                    </Box>
                    <Box
                      sx={{
                        flex: "0 0 150px",
                        padding: "12px 16px",
                        fontWeight: "medium",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {review.category}
                    </Box>
                    <Box
                      sx={{
                        flex: "1 1 auto",
                        padding: "12px 16px",
                        fontSize: "0.875rem",
                        minWidth: "300px",
                        display: "flex",
                        alignItems: "center",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {review.review}
                    </Box>
                    <Box
                      sx={{
                        flex: "0 0 120px",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Chip
                        label={review.sentiment}
                        color={getSentimentColor(review.sentiment)}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </MDBox>
      </Card>
    </MDBox>
  );
}

SentimentAnalysis.propTypes = {
  onDatasetCleared: PropTypes.bool,
  onDatasetUploaded: PropTypes.number,
  selectedCategory: PropTypes.string,
};

export default SentimentAnalysis;

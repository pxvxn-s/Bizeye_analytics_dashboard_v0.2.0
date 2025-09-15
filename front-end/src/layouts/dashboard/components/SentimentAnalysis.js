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
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// API Service
import apiService from "services/apiService";

function SentimentAnalysis({ onDatasetCleared, onDatasetUploaded, selectedCategory, categories, onSentimentDataUpdate }) {
  console.log("🔄 SentimentAnalysis rendered with selectedCategory:", selectedCategory);
  console.log("🔄 SentimentAnalysis rendered with categories:", categories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sentimentData, setSentimentData] = useState(null);
  const [hasDataset, setHasDataset] = useState(false);

  // Generate 240 rows of sample data
  const generateSampleData = () => {
    const products = [
      { name: "iPhone 14 Pro", category: "Electronics" },
      { name: "Samsung Galaxy S23", category: "Electronics" },
      { name: "MacBook Pro M2", category: "Electronics" },
      { name: "Dell XPS 13", category: "Electronics" },
      { name: "Sony WH-1000XM4", category: "Electronics" },
      { name: "Apple Watch Series 8", category: "Electronics" },
      { name: "iPad Air", category: "Electronics" },
      { name: "Nintendo Switch", category: "Electronics" },
      { name: "PlayStation 5", category: "Electronics" },
      { name: "Xbox Series X", category: "Electronics" },
      { name: "Dyson V11 Vacuum", category: "Home Appliances" },
      { name: "Instant Pot Duo", category: "Home Appliances" },
      { name: "KitchenAid Mixer", category: "Home Appliances" },
      { name: "Roomba i7+", category: "Home Appliances" },
      { name: "Keurig K-Elite", category: "Home Appliances" },
      { name: "Ninja Food Processor", category: "Home Appliances" },
      { name: "Vitamix Blender", category: "Home Appliances" },
      { name: "Breville Espresso Machine", category: "Home Appliances" },
      { name: "Dyson Airwrap", category: "Beauty Products" },
      { name: "Neutrogena Skincare Set", category: "Beauty Products" },
      { name: "L'Oreal Foundation", category: "Beauty Products" },
      { name: "Maybelline Mascara", category: "Beauty Products" },
      { name: "Nike Air Max 270", category: "Sports" },
      { name: "Adidas Ultraboost", category: "Sports" },
      { name: "Under Armour Shoes", category: "Sports" },
      { name: "Peloton Bike", category: "Sports" },
      { name: "Yoga Mat", category: "Sports" },
      { name: "Levi's 501 Jeans", category: "Clothing" },
      { name: "Calvin Klein T-Shirt", category: "Clothing" },
      { name: "Zara Dress", category: "Clothing" },
      { name: "H&M Jacket", category: "Clothing" },
      { name: "The Da Vinci Code", category: "Books" },
      { name: "Harry Potter Series", category: "Books" },
      { name: "Kindle Paperwhite", category: "Books" },
      { name: "Tesla Model 3", category: "Automotive" },
      { name: "BMW X5", category: "Automotive" },
      { name: "Toyota Camry", category: "Automotive" },
      { name: "Honda Civic", category: "Automotive" },
      { name: "Mercedes C-Class", category: "Automotive" },
    ];

    const positiveReviews = [
      "Absolutely fantastic! Exceeded all my expectations.",
      "Outstanding quality and performance. Highly recommend!",
      "Best purchase I've made this year. Worth every penny!",
      "Excellent product with amazing features.",
      "Love it! Perfect for my needs.",
      "Great value for money. Very satisfied.",
      "Top quality and fast delivery.",
      "Amazing product! Will definitely buy again.",
      "Perfect! Exactly what I was looking for.",
      "Excellent customer service and great product.",
    ];

    const negativeReviews = [
      "A complete failure. I had to return it.",
      "Terrible quality. Not worth the money.",
      "Poor customer service and defective product.",
      "Waste of money. Doesn't work as advertised.",
      "Very disappointed with this purchase.",
      "Low quality materials and poor construction.",
      "Arrived damaged and customer service was unhelpful.",
      "Not as described. Very misleading.",
      "Poor quality control. Avoid this product.",
      "Complete waste of money. Regret buying this.",
    ];

    const neutralReviews = [
      "Average product. Nothing special but gets the job done.",
      "Decent quality for the price point.",
      "Okay product. Could be better but not terrible.",
      "Fair quality. Meets basic expectations.",
      "Standard product. Nothing exceptional.",
      "Adequate for basic needs.",
      "Average performance. Neither great nor terrible.",
      "Decent value. Satisfactory quality.",
      "Okay for the price. Nothing more, nothing less.",
      "Standard quality. Meets expectations.",
    ];

    const reviews = [];
    for (let i = 1; i <= 240; i++) {
      const product = products[i % products.length];
      const sentiment = i % 3 === 0 ? "Negative" : i % 3 === 1 ? "Positive" : "Neutral";
      const reviewTexts =
        sentiment === "Positive" ? positiveReviews : sentiment === "Negative" ? negativeReviews : neutralReviews;

      reviews.push({
        id: `P${String(i).padStart(3, "0")}`,
        productName: `${product.name} ${i > 40 ? `(${Math.floor(i / 10) + 1})` : ""}`,
        category: product.category,
        review: reviewTexts[i % reviewTexts.length],
        sentiment: sentiment,
      });
    }
    return reviews;
  };

  // Load sentiment data from API
  const loadSentimentData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use selectedCategory for filtering, pass "all" as null to get all data
      const categoryFilter = selectedCategory === "all" ? null : selectedCategory;
      const response = await apiService.getSentimentReviews(1, 1000, categoryFilter); // Get up to 1000 reviews
      console.log("SentimentAnalysis API response:", response);
      if (response.status === "success" && response.reviews) {
        const apiReviews = response.reviews || [];
        console.log("API reviews:", apiReviews);
        const normalizedReviews = apiReviews.map((review) => ({
          id: review.product_id || review.id || `P${Math.random().toString(36).substr(2, 9)}`,
          productName: review.product_name || review.productName || "Unknown Product",
          category: review.product_category || review.category || "Unknown",
          review: review.review || review.review_content || "No review text",
          sentiment: review.sentiment || "Neutral",
        }));
        console.log("Normalized reviews:", normalizedReviews);

        // Only use API data if it exists, don't fall back to sample data
        if (normalizedReviews.length > 0) {
          console.log("Setting hasDataset to true, reviews count:", normalizedReviews.length);
          setReviews(normalizedReviews);
          setHasDataset(true);
          // Calculate basic sentiment data from reviews
          const sentimentCounts = normalizedReviews.reduce((acc, review) => {
            const sentiment = review.sentiment?.toLowerCase() || 'neutral';
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
          }, {});
          const sentimentDataToSet = {
            total_reviews: normalizedReviews.length,
            positive_percentage: ((sentimentCounts.positive || 0) / normalizedReviews.length) * 100,
            negative_percentage: ((sentimentCounts.negative || 0) / normalizedReviews.length) * 100,
            neutral_percentage: ((sentimentCounts.neutral || 0) / normalizedReviews.length) * 100,
          };
          setSentimentData(sentimentDataToSet);
          
          // Update parent component with sentiment data
          if (onSentimentDataUpdate) {
            onSentimentDataUpdate(sentimentDataToSet);
          }
        } else {
          console.log("No reviews found, setting hasDataset to false");
          // No real data from API
          setReviews([]);
          setHasDataset(false);
          setSentimentData(null);
          
          // Update parent component with null sentiment data
          if (onSentimentDataUpdate) {
            onSentimentDataUpdate(null);
          }
        }
      } else {
        // No data from API, keep empty
        setReviews([]);
        setHasDataset(false);
        setSentimentData(null);
        
        // Update parent component with null sentiment data
        if (onSentimentDataUpdate) {
          onSentimentDataUpdate(null);
        }
      }
    } catch (err) {
      console.error("Error loading sentiment data:", err);
      // Don't show error message for expected cases (backend not running)
      // setError("Failed to load sentiment data");
      setReviews([]);
      setHasDataset(false);
      setSentimentData(null);
      
      // Update parent component with null sentiment data
      if (onSentimentDataUpdate) {
        onSentimentDataUpdate(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSentimentData();
  }, []);

  // Reload data when dataset is uploaded
  useEffect(() => {
    if (onDatasetUploaded && onDatasetUploaded > 0) {
      console.log("Dataset uploaded, reloading sentiment data...");
      loadSentimentData();
    }
  }, [onDatasetUploaded]);

  // Reload data when category selection changes
  useEffect(() => {
    if (hasDataset) {
      console.log("Category changed to:", selectedCategory, "reloading sentiment data...");
      loadSentimentData();
    }
  }, [selectedCategory]);

  // Filter and sort reviews
  useEffect(() => {
    let filtered = reviews;

    // Filter by search term only (category filtering is done at API level)
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort reviews
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "id") {
        aValue = parseInt(aValue.replace("P", ""));
        bValue = parseInt(bValue.replace("P", ""));
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, sortField, sortDirection]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      case "neutral":
        return "warning";
      default:
        return "default";
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "thumb_up";
      case "negative":
        return "thumb_down";
      case "neutral":
        return "thumbs_up_down";
      default:
        return "help";
    }
  };

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

  return (
    <Card>
      <MDBox p={3}>
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
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
        ) : !hasDataset ? (
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}
            sx={{ backgroundColor: "#f8f9fa", borderRadius: 2 }}
          >
            <Icon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}>
              dataset
            </Icon>
            <MDTypography variant="h6" color="text.secondary" mb={1}>
              No Dataset Imported
            </MDTypography>
            <MDTypography variant="body2" color="text.secondary" textAlign="center">
              Please import a dataset to view product reviews analysis
            </MDTypography>
          </MDBox>
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
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #dee2e6",
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
                  whiteSpace: "nowrap",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSort("id")}
              >
                Product ID
              </Box>
              <Box
                sx={{
                  flex: "0 0 200px",
                  padding: "12px 16px",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSort("productName")}
              >
                Product Name {sortField === "productName" && (sortDirection === "asc" ? "↑" : "↓")}
              </Box>
              <Box
                sx={{
                  flex: "0 0 150px",
                  padding: "12px 16px",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSort("category")}
              >
                Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
              </Box>
              <Box
                sx={{
                  flex: "1 1 300px",
                  padding: "12px 16px",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
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
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => handleSort("sentiment")}
              >
                Sentiment {sortField === "sentiment" && (sortDirection === "asc" ? "↑" : "↓")}
              </Box>
            </Box>

            {/* Scrollable Data Rows */}
            <Box
              sx={{
                maxHeight: 400,
                overflow: "auto",
              }}
            >
              {filteredReviews.map((review, index) => (
                <Box
                  key={review.id || index}
                  sx={{
                    display: "flex",
                    borderBottom: "1px solid #f0f0f0",
                    "&:hover": { backgroundColor: "#f8f9fa" },
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
                      whiteSpace: "nowrap",
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
                      flex: "1 1 300px",
                      padding: "12px 16px",
                      fontSize: "0.875rem",
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
  );
}

SentimentAnalysis.propTypes = {
  onDatasetCleared: PropTypes.func,
  onDatasetUploaded: PropTypes.number,
  selectedCategory: PropTypes.string,
  categories: PropTypes.array,
  onSentimentDataUpdate: PropTypes.func,
};

export default SentimentAnalysis;

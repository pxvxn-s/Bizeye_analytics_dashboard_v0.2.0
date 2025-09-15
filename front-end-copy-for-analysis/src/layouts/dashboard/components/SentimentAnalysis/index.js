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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/SentimentAnalysis/data";

// API Service
import apiService from "services/apiService";

function SentimentAnalysis() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  // Load sentiment data on component mount
  useEffect(() => {
    loadSentimentData();
  }, []);

  const loadSentimentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get sentiment analysis summary
      const analysisResponse = await apiService.analyzeSentiment();

      if (analysisResponse.status === "success") {
        setSentimentData(analysisResponse.summary);
      }

      // Get reviews for table
      await loadReviews(1);
    } catch (err) {
      console.error("Error loading sentiment data:", err);
      setError("Failed to load sentiment data. Using mock data instead.");

      // Use mock data as fallback
      setReviews(rows.slice(0, 10));
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (page) => {
    try {
      const response = await apiService.getSentimentReviews(page, 10);

      if (response.status === "success") {
        setReviews(response.reviews);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.total_pages);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      // Use mock data as fallback
      setReviews(rows.slice((page - 1) * 10, page * 10));
    }
  };

  const handleRefresh = () => {
    loadSentimentData();
    closeMenu();
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log("Export data functionality to be implemented");
    closeMenu();
  };

  const handleFilterReviews = () => {
    // TODO: Implement review filtering functionality
    console.log("Filter reviews functionality to be implemented");
    closeMenu();
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

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "sentiment_very_satisfied";
      case "negative":
        return "sentiment_very_dissatisfied";
      case "neutral":
        return "sentiment_neutral";
      default:
        return "help";
    }
  };

  // Format reviews for DataTable
  const formattedReviews = reviews.map((review, index) => ({
    product_id: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {review.product_id}
      </MDTypography>
    ),
    product_name: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {review.product_name}
      </MDTypography>
    ),
    model_name: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {review.model_name}
      </MDTypography>
    ),
    review: (
      <MDTypography variant="caption" color="text" fontWeight="regular">
        {review.review.length > 100 ? `${review.review.substring(0, 100)}...` : review.review}
      </MDTypography>
    ),
    sentiment: (
      <Chip
        icon={<Icon>{getSentimentIcon(review.sentiment)}</Icon>}
        label={review.sentiment}
        color={getSentimentColor(review.sentiment)}
        size="small"
        variant="outlined"
      />
    ),
  }));

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={handleExportData}>Export Data</MenuItem>
      <MenuItem onClick={handleFilterReviews}>Filter Reviews</MenuItem>
      <MenuItem onClick={handleRefresh}>Refresh Analysis</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Customers Overall Review
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              sentiment_analysis
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Sentiment Analysis</strong> from customer feedback
            </MDTypography>
          </MDBox>

          {/* Sentiment Summary */}
          {sentimentData && (
            <MDBox mt={2} display="flex" gap={2} flexWrap="wrap">
              <Chip
                icon={<Icon>sentiment_very_satisfied</Icon>}
                label={`Positive: ${
                  sentimentData.sentiment_percentages?.Positive?.toFixed(1) || 0
                }%`}
                color="success"
                size="small"
              />
              <Chip
                icon={<Icon>sentiment_neutral</Icon>}
                label={`Neutral: ${sentimentData.sentiment_percentages?.Neutral?.toFixed(1) || 0}%`}
                color="info"
                size="small"
              />
              <Chip
                icon={<Icon>sentiment_very_dissatisfied</Icon>}
                label={`Negative: ${
                  sentimentData.sentiment_percentages?.Negative?.toFixed(1) || 0
                }%`}
                color="error"
                size="small"
              />
            </MDBox>
          )}
        </MDBox>

        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>

      <MDBox>
        {loading ? (
          <MDBox display="flex" justifyContent="center" p={3}>
            <CircularProgress size={40} />
          </MDBox>
        ) : error ? (
          <Alert severity="warning" sx={{ m: 3 }}>
            {error}
          </Alert>
        ) : (
          <DataTable
            table={{
              columns,
              rows: formattedReviews.length > 0 ? formattedReviews : rows,
            }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
        )}
      </MDBox>
    </Card>
  );
}

export default SentimentAnalysis;

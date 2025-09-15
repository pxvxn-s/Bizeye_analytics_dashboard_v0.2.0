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
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// TODO: Replace with backend API call to fetch sentiment analysis data
// Expected API endpoint: GET /api/sentiment-analysis/reviews
// Expected response format:
// {
//   reviews: [
//     {
//       productId: string,
//       productName: string,
//       modelName: string,
//       review: string,
//       sentiment: 'positive' | 'negative' | 'neutral',
//       rating: number,
//       timestamp: string
//     }
//   ]
// }

export default function data() {
  // TODO: Replace with actual data from backend
  const sampleData = [
    {
      productId: "PROD001",
      productName: "Samsung Galaxy M33",
      modelName: "M33 5G",
      review: "Great phone with excellent battery life and smooth performance. Camera quality is amazing!",
      sentiment: "positive",
      rating: 4.5,
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      productId: "PROD002",
      productName: "Fire-Boltt SmartWatch",
      modelName: "Ninja Call Pro Plus",
      review: "Decent smartwatch but the battery drains too quickly. Needs improvement in battery optimization.",
      sentiment: "negative",
      rating: 2.8,
      timestamp: "2024-01-14T15:45:00Z",
    },
    {
      productId: "PROD003",
      productName: "SanDisk USB Drive",
      modelName: "Ultra USB 3.0",
      review: "Fast transfer speeds and reliable storage. Good value for money.",
      sentiment: "positive",
      rating: 4.2,
      timestamp: "2024-01-13T09:20:00Z",
    },
    {
      productId: "PROD004",
      productName: "Apple iPhone 14",
      modelName: "iPhone 14 Pro",
      review: "Premium build quality and excellent camera system. Expensive but worth it.",
      sentiment: "positive",
      rating: 4.7,
      timestamp: "2024-01-12T14:15:00Z",
    },
    {
      productId: "PROD005",
      productName: "OnePlus Nord CE",
      modelName: "Nord CE 3 Lite",
      review: "Average performance for the price. Nothing exceptional but gets the job done.",
      sentiment: "neutral",
      rating: 3.2,
      timestamp: "2024-01-11T11:30:00Z",
    },
  ];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "sentiment_very_satisfied";
      case "negative":
        return "sentiment_very_dissatisfied";
      case "neutral":
        return "sentiment_neutral";
      default:
        return "sentiment_neutral";
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      case "neutral":
        return "warning";
      default:
        return "info";
    }
  };

  return {
    columns: [
      { Header: "Product ID", accessor: "productId", width: "15%", align: "left" },
      { Header: "Product Name", accessor: "productName", width: "25%", align: "left" },
      { Header: "Model", accessor: "modelName", width: "20%", align: "left" },
      { Header: "Customer Review", accessor: "review", width: "40%", align: "left" },
    ],

    rows: sampleData.map((item) => ({
      productId: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.productId}
        </MDTypography>
      ),
      productName: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.productName}
        </MDTypography>
      ),
      modelName: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.modelName}
        </MDTypography>
      ),
      review: (
        <MDBox display="flex" alignItems="center" py={1}>
          <Tooltip title={`Sentiment: ${item.sentiment}`} placement="top">
            <Icon
              sx={{
                color: ({ palette }) => palette[getSentimentColor(item.sentiment)].main,
                mr: 1,
                fontSize: "1rem",
              }}
            >
              {getSentimentIcon(item.sentiment)}
            </Icon>
          </Tooltip>
          <MDTypography variant="caption" color="text" fontWeight="regular">
            {item.review}
          </MDTypography>
        </MDBox>
      ),
    })),
  };
}

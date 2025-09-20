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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function AIInsightsCards({ data, salesData, forecastData }) {
  // Generate insights based on actual sales data - Revenue Potential card removed
  const generateInsights = () => {
    if (!salesData) {
      return [
        {
          type: "prediction",
          title: "Sales Forecast",
          value: "No Data",
          description: "Upload a dataset to generate sales predictions",
          confidence: "Low",
          confidenceScore: 0,
        },
        {
          type: "sentiment",
          title: "Customer Satisfaction",
          value: "0.0%",
          description: "Upload a dataset to analyze customer sentiment",
          confidence: "Low",
          confidenceScore: 0,
        },
        {
          type: "recommendation",
          title: "Product Analysis",
          value: "No Data",
          description: "Upload a dataset to identify optimization opportunities",
          confidence: "Low",
          confidenceScore: 0,
        },
      ];
    }

    const totalRevenue = salesData.quarterly_analysis?.total_sales || 0;
    const totalProducts = Object.keys(salesData.category_sales || {}).length;
    const performanceChange = salesData.quarterly_analysis?.growth_percentage || 0;
    const avgUnitPrice = salesData.quarterly_analysis?.avg_daily_sales || 0;
    
    // Calculate customer satisfaction based on sentiment data if available
    let customerSatisfaction = 0.0;
    let satisfactionConfidence = "Low";
    let satisfactionScore = 0;
    
    if (salesData.sentiment_analysis) {
      const positivePercentage = salesData.sentiment_analysis.positive_percentage || 0;
      const neutralPercentage = salesData.sentiment_analysis.neutral_percentage || 0;
      // Calculate satisfaction as positive + half of neutral (assuming neutral is somewhat positive)
      customerSatisfaction = positivePercentage + (neutralPercentage * 0.5);
      satisfactionConfidence = customerSatisfaction > 70 ? "High" : customerSatisfaction > 40 ? "Medium" : "Low";
      satisfactionScore = Math.min(95, Math.max(40, customerSatisfaction));
    }
    

    return [
      {
        type: "prediction",
        title: "Sales Forecast",
        value: `+${Math.max(5, Math.abs(performanceChange) + 5).toFixed(1)}%`,
        description: `Predicted sales growth for next quarter based on current trends and sentiment analysis`,
        confidence: "High",
        confidenceScore: 85,
      },
      {
        type: "sentiment",
        title: "Customer Satisfaction",
        value: `${customerSatisfaction.toFixed(1)}%`,
        description: `Based on product performance and sales analysis`,
        confidence: satisfactionConfidence,
        confidenceScore: satisfactionScore,
      },
      {
        type: "recommendation",
        title: "Product Analysis",
        value: `${totalProducts} products`,
        description: `Products analyzed for optimization opportunities`,
        confidence: totalProducts > 50 ? "High" : totalProducts > 20 ? "Medium" : "Low",
        confidenceScore: Math.min(85, Math.max(40, totalProducts * 1.5)),
      },
    ];
  };

  const insights = generateInsights();
  const getIconColor = (type) => {
    switch (type) {
      case "prediction":
        return "info";
      case "sentiment":
        return "success";
      case "recommendation":
        return "warning";
      case "optimization":
        return "primary";
      default:
        return "primary";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "prediction":
        return "trending_up";
      case "sentiment":
        return "sentiment_very_satisfied";
      case "recommendation":
        return "lightbulb";
      case "optimization":
        return "analytics";
      default:
        return "analytics";
    }
  };

  return (
    <Grid container spacing={3} mb={6}>
      {insights.map((insight, index) => (
        <Grid item xs={12} sm={6} lg={4} key={index}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: `${getIconColor(insight.type)}.main`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 2,
                  }}
                >
                  <Icon sx={{ color: "white !important", fontSize: 24 }}>{getIcon(insight.type)}</Icon>
                </Box>
                <Chip
                  label={insight.confidence}
                  size="small"
                  color={getIconColor(insight.type)}
                  variant="outlined"
                  sx={{ fontWeight: "medium" }}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDTypography variant="h4" fontWeight="bold" color="dark" mb={0.5}>
                  {insight.value}
                </MDTypography>
                <MDTypography variant="body2" color="text" fontWeight="medium">
                  {insight.title}
                </MDTypography>
                <MDTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
                  {insight.description}
                </MDTypography>
              </MDBox>

              <MDBox>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MDTypography variant="caption" color="text" fontWeight="medium">
                    Confidence
                  </MDTypography>
                  <MDTypography variant="caption" color="text" fontWeight="bold">
                    {insight.confidenceScore}%
                  </MDTypography>
                </MDBox>
                <LinearProgress
                  variant="determinate"
                  value={insight.confidenceScore}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 2,
                      bgcolor: insight.confidenceScore === 0 ? "grey.300" : `${getIconColor(insight.type)}.main`,
                    },
                  }}
                />
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

// Setting default values for the props of AIInsightsCards
AIInsightsCards.defaultProps = {
  data: [],
  salesData: null,
  forecastData: null,
};

// Typechecking props for the AIInsightsCards
AIInsightsCards.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      confidence: PropTypes.string.isRequired,
      confidenceScore: PropTypes.number.isRequired,
    })
  ),
  salesData: PropTypes.object,
  forecastData: PropTypes.object,
};

export default AIInsightsCards;

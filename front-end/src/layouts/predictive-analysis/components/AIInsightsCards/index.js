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

function AIInsightsCards({ data }) {
  const getIconColor = (type) => {
    switch (type) {
      case "growth":
        return "success";
      case "risk":
        return "error";
      case "opportunity":
        return "info";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "growth":
        return "trending_up";
      case "risk":
        return "warning";
      case "opportunity":
        return "lightbulb";
      case "warning":
        return "priority_high";
      default:
        return "analytics";
    }
  };

  return (
    <Grid container spacing={3} mb={4}>
      {data.map((insight, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
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
                  <Icon sx={{ color: "white", fontSize: 24 }}>{getIcon(insight.type)}</Icon>
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
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: `${getIconColor(insight.type)}.main`,
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
};

export default AIInsightsCards;

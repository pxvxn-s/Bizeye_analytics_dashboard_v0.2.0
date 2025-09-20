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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function ProductRecommendationSystem({ data, selectedCategory }) {
  const getPriorityColor = (priority) => {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "success";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "High") return "priority_high";
    if (priority === "Medium") return "warning";
    return "check_circle";
  };

  const handleApplyRecommendation = (productId) => {
    // TODO: Connect to recommendation application API here
    console.log("Applying recommendation for product:", productId);
  };

  return (
    <MDBox>
      {/* Section Header */}
      <MDBox mb={3}>
        <MDTypography variant="h4" fontWeight="medium" color="dark">
          AI Product Recommendation System
        </MDTypography>
        <MDTypography variant="body2" color="text" mt={1}>
          {selectedCategory === "all" ? "All Categories" : `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`} - {data.length} recommendations available
        </MDTypography>
      </MDBox>

      {/* Recommendations List */}
      <MDBox>
        {data.length > 0 ? (
          data.map((recommendation, index) => (
            <Card key={index} sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Accordion
                  sx={{
                    boxShadow: "none",
                    "&:before": { display: "none" },
                    "&.Mui-expanded": {
                      margin: 0,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<Icon>expand_more</Icon>}
                    sx={{
                      px: 0,
                      "&.Mui-expanded": {
                        minHeight: "auto",
                      },
                    }}
                  >
                    <MDBox display="flex" alignItems="center" width="100%">
                      <MDBox display="flex" alignItems="center" gap={2} flex={1}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: `${getPriorityColor(recommendation.priority)}.main`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon sx={{ color: "white !important", fontSize: 20 }}>
                            {getPriorityIcon(recommendation.priority)}
                          </Icon>
                        </Box>
                        <MDBox>
                          <MDTypography variant="h6" fontWeight="bold" color="dark">
                            {recommendation.productName}
                          </MDTypography>
                          <MDTypography variant="body2" color="text.secondary">
                            Product ID: {recommendation.productId}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" gap={2}>
                        <Chip
                          label={recommendation.priority}
                          color={getPriorityColor(recommendation.priority)}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                        <Chip
                          label={`+${recommendation.expectedImprovement}%`}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      </MDBox>
                    </MDBox>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pt: 2 }}>
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                        Recommendations
                      </MDTypography>
                      <MDBox mb={3}>
                        {recommendation.recommendations.map((rec, recIndex) => (
                          <MDBox
                            key={recIndex}
                            sx={{
                              p: 2,
                              mb: 2,
                              backgroundColor: "grey.50",
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            <MDBox display="flex" alignItems="flex-start" gap={2}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1,
                                  bgcolor: "primary.main",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mt: 0.5,
                                }}
                              >
                                <Icon sx={{ color: "white !important", fontSize: 18 }}>
                                  {rec.type === "pricing" ? "attach_money" :
                                   rec.type === "quality" ? "star" :
                                   rec.type === "marketing" ? "campaign" : "lightbulb"}
                                </Icon>
                              </Box>
                              <MDBox flex={1}>
                                <MDTypography variant="subtitle1" fontWeight="bold" color="dark" mb={1}>
                                  {rec.title}
                                </MDTypography>
                                <MDTypography variant="body2" color="text" mb={1}>
                                  {rec.description}
                                </MDTypography>
                                <MDBox display="flex" gap={1} flexWrap="wrap">
                                  {rec.tags.map((tag, tagIndex) => (
                                    <Chip
                                      key={tagIndex}
                                      label={tag}
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                    />
                                  ))}
                                </MDBox>
                              </MDBox>
                              <Chip
                                label={`${rec.impact}% impact`}
                                color="success"
                                size="small"
                                sx={{ fontWeight: "bold" }}
                              />
                            </MDBox>
                          </MDBox>
                        ))}
                      </MDBox>
                      
                      <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDBox>
                          <MDTypography variant="body2" color="text.secondary" mb={1}>
                            Expected Results
                          </MDTypography>
                          <MDTypography variant="body2" color="text">
                            • Sales increase: +{recommendation.expectedImprovement}%
                            • Revenue impact: ₹{recommendation.revenueImpact.toLocaleString()}
                            • Implementation time: {recommendation.implementationTime}
                          </MDTypography>
                        </MDBox>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApplyRecommendation(recommendation.productId)}
                          sx={{
                            color: "white !important",
                            fontWeight: "bold",
                            "&:hover": {
                              color: "white !important",
                            },
                          }}
                        >
                          Apply Recommendations
                        </Button>
                      </MDBox>
                    </MDBox>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          /* Placeholder content when no data is available */
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 4 }}>
              <MDBox textAlign="center">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Icon sx={{ color: "white !important", fontSize: 40 }}>
                    lightbulb
                  </Icon>
                </Box>
                <MDTypography variant="h5" fontWeight="bold" color="dark" mb={2}>
                  AI Recommendations Ready
                </MDTypography>
                <MDTypography variant="body1" color="text.secondary" mb={3}>
                  Import a dataset to unlock AI-powered product recommendations and optimization insights.
                </MDTypography>
                <MDBox
                  sx={{
                    p: 3,
                    backgroundColor: "grey.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <MDTypography variant="subtitle1" fontWeight="bold" color="dark" mb={2}>
                    What you&apos;ll get:
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: "success.main", fontSize: 20 }}>check_circle</Icon>
                      <MDTypography variant="body2" color="text">
                        Product-specific improvement recommendations
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: "success.main", fontSize: 20 }}>check_circle</Icon>
                      <MDTypography variant="body2" color="text">
                        Revenue impact predictions
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: "success.main", fontSize: 20 }}>check_circle</Icon>
                      <MDTypography variant="body2" color="text">
                        Implementation time estimates
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: "success.main", fontSize: 20 }}>check_circle</Icon>
                      <MDTypography variant="body2" color="text">
                        Priority-based action plans
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </CardContent>
          </Card>
        )}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of ProductRecommendationSystem
ProductRecommendationSystem.defaultProps = {
  data: [],
  selectedCategory: "all",
};

// Typechecking props for the ProductRecommendationSystem
ProductRecommendationSystem.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      expectedImprovement: PropTypes.number.isRequired,
      revenueImpact: PropTypes.number.isRequired,
      implementationTime: PropTypes.string.isRequired,
      recommendations: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          impact: PropTypes.number.isRequired,
          tags: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
      ).isRequired,
    })
  ),
  selectedCategory: PropTypes.string,
};

export default ProductRecommendationSystem;

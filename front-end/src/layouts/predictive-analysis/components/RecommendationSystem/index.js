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
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import LinearProgress from "@mui/material/LinearProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import apiService from "services/apiService";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function RecommendationSystem({ data, selectedCategory, onRecommendationSelect }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiModel, setAiModel] = useState('Advanced ML Models');

  // Fetch AI recommendations from backend using new intelligent analysis endpoints
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      if (!data) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use the new intelligent analysis endpoint
        const response = await fetch('http://localhost:5000/api/intelligent/recommendations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Intelligent recommendations response:', result);
          
          if (result.status === 'success' && result.category_recommendations) {
            // Handle new sentiment-based category recommendations structure
            const categoryRecommendations = result.category_recommendations;
            
            if (Array.isArray(categoryRecommendations) && categoryRecommendations.length > 0) {
              // Transform category recommendations to frontend format
              const transformedRecommendations = [];
              
              categoryRecommendations.forEach((categoryRec, categoryIndex) => {
                if (categoryRec.recommendations && Array.isArray(categoryRec.recommendations)) {
                  categoryRec.recommendations.forEach((rec, recIndex) => {
                    transformedRecommendations.push({
                      id: `sentiment-rec-${categoryIndex}-${recIndex}`,
                      category: categoryRec.category,
                      title: rec.title || rec.recommendation || 'Sentiment-Based Recommendation',
                      description: rec.recommendation || 'Detailed improvement recommendation',
                      problemDescription: rec.problem_description || 'Customer feedback indicates areas for improvement',
                      detailedAnalysis: rec.detailed_analysis || 'Analysis of customer reviews reveals specific concerns',
                      impact: Math.round((rec.confidence_score || 0.8) * 100),
                      implementation: '2-4 weeks',
                      expectedIncrease: rec.expected_impact || '+25%',
                      priority: rec.priority || 'High',
                      type: 'sentiment-based',
                      aiConfidence: rec.confidence_score ? `${Math.round(rec.confidence_score * 100)}%` : 'High',
                      specificActions: rec.specific_actions || [],
                      successMetrics: rec.success_metrics || ['Customer satisfaction', 'Review ratings'],
                      priorityReason: rec.priority_reason || 'This improvement will enhance customer experience',
                      aiModel: result.ai_model || 'Sentiment-Based AI Engine',
                      affectedReviews: rec.affected_reviews || categoryRec.problem_reviews_count || 0,
                      problemPercentage: rec.negative_percentage || categoryRec.negative_percentage || 0,
                      neutralPercentage: rec.neutral_percentage || categoryRec.neutral_percentage || 0,
                      totalReviews: categoryRec.total_reviews || 0,
                      aiAnalysis: rec.ai_analysis || null,
                    });
                  });
                }
              });
              
              setRecommendations(transformedRecommendations);
              setAiModel(result.ai_model || 'Sentiment-Based AI Engine');
              console.log('✅ Loaded sentiment-based AI recommendations:', transformedRecommendations.length);
            } else {
              console.log('⚠️ No category recommendations array in response, using fallback');
              setRecommendations(generateRecommendations());
            }
          } else {
            console.log('⚠️ No category recommendations in response, using fallback');
            setRecommendations(generateRecommendations());
          }
        } else {
          console.log('⚠️ Intelligent recommendations endpoint failed with status:', response.status);
          setRecommendations(generateRecommendations());
        }
      } catch (err) {
        console.error('Error fetching intelligent AI recommendations:', err);
        setError('Failed to load AI recommendations');
        // Fallback to generated recommendations
        setRecommendations(generateRecommendations());
      } finally {
        setLoading(false);
      }
    };

    fetchAIRecommendations();
  }, [data, selectedCategory]);

  // Generate fallback recommendations based on category and data
  const generateRecommendations = () => {
    if (!data || !selectedCategory) {
      return [];
    }

    const recommendations = [];
    
    // Generate category-specific recommendations
    if (selectedCategory === "all" || selectedCategory === "Electronics") {
      recommendations.push({
        id: "electronics-pricing",
        category: "Electronics",
        title: "Optimize Pricing Strategy",
        description: "Reduce prices by 10-15% to match competitor pricing and increase market share",
        impact: 85,
        implementation: "2-3 weeks",
        expectedIncrease: "+25%",
        priority: "High",
        type: "pricing"
      });
    }

    if (selectedCategory === "all" || selectedCategory === "Clothing") {
      recommendations.push({
        id: "clothing-seasonal",
        category: "Clothing",
        title: "Seasonal Marketing Campaign",
        description: "Launch targeted seasonal campaigns to boost sales during peak periods",
        impact: 75,
        implementation: "1-2 weeks",
        expectedIncrease: "+18%",
        priority: "Medium",
        type: "marketing"
      });
    }

    if (selectedCategory === "all" || selectedCategory === "Home Appliances") {
      recommendations.push({
        id: "home-bundling",
        category: "Home Appliances",
        title: "Product Bundling Strategy",
        description: "Create bundle offers with complementary products to increase average order value",
        impact: 70,
        implementation: "3-4 weeks",
        expectedIncrease: "+22%",
        priority: "High",
        type: "bundling"
      });
    }

    if (selectedCategory === "all" || selectedCategory === "Sports") {
      recommendations.push({
        id: "sports-quality",
        category: "Sports",
        title: "Quality Enhancement",
        description: "Improve product quality based on customer feedback to reduce returns",
        impact: 80,
        implementation: "4-6 weeks",
        expectedIncrease: "+15%",
        priority: "High",
        type: "quality"
      });
    }

    if (selectedCategory === "all" || selectedCategory === "Books") {
      recommendations.push({
        id: "books-digital",
        category: "Books",
        title: "Digital Marketing Push",
        description: "Increase digital marketing spend to reach more readers and boost online sales",
        impact: 65,
        implementation: "1-2 weeks",
        expectedIncrease: "+20%",
        priority: "Medium",
        type: "marketing"
      });
    }

    return recommendations;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "info";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "pricing": return "price_check";
      case "marketing": return "campaign";
      case "bundling": return "inventory";
      case "quality": return "verified";
      default: return "lightbulb";
    }
  };

  const handleRecommendationClick = (recommendation) => {
    if (onRecommendationSelect) {
      onRecommendationSelect(recommendation);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <MDBox
          p={3}
          sx={{
            borderBottom: "1px solid",
            borderColor: "grey.200",
            background: "linear-gradient(135deg, #1976d2 0%, #1976d2 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" fontWeight="bold" color="white" mb={0.5}>
                AI Recommendations
              </MDTypography>
            </MDBox>
            <Box display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "white" }}>lightbulb</Icon>
              <MDTypography variant="body2" color="white" fontWeight="medium">
                {recommendations.length} Recommendations
              </MDTypography>
            </Box>
          </MDBox>
        </MDBox>

        {/* Recommendations List */}
        <MDBox p={3}>
          {loading ? (
            <MDBox textAlign="center" py={4}>
              <MDTypography variant="h6" color="text.secondary" mb={2}>
                Loading AI Recommendations...
              </MDTypography>
              <LinearProgress sx={{ width: '100%', maxWidth: 300, mx: 'auto' }} />
            </MDBox>
          ) : error ? (
            <MDBox textAlign="center" py={4}>
              <MDTypography variant="h6" color="error" mb={2}>
                {error}
              </MDTypography>
              <MDTypography variant="body2" color="text.secondary">
                Using fallback recommendations
              </MDTypography>
            </MDBox>
          ) : recommendations.length === 0 ? (
            <MDBox textAlign="center" py={4}>
              <Icon sx={{ fontSize: 48, color: "grey.400", mb: 2 }}>lightbulb_outline</Icon>
              <MDTypography variant="h6" color="text" mb={1}>
                No Recommendations Available
              </MDTypography>
              <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                Upload a dataset to generate AI-powered recommendations
              </MDTypography>
            </MDBox>
          ) : (
            recommendations.map((rec, index) => (
              <Accordion key={rec.id} sx={{ mb: 2, boxShadow: 1 }}>
                <AccordionSummary
                  expandIcon={<Icon>expand_more</Icon>}
                  sx={{
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  <MDBox display="flex" alignItems="center" width="100%" gap={2}>
                    <Icon sx={{ color: `${getPriorityColor(rec.priority)}.main` }}>
                      {getTypeIcon(rec.type)}
                    </Icon>
                    <MDBox flex={1}>
                      <MDTypography variant="subtitle1" fontWeight="medium">
                        {rec.title}
                      </MDTypography>
                      <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                        {rec.category} • Expected: {rec.expectedIncrease}
                        {rec.affectedReviews && (
                          <span> • {rec.affectedReviews} reviews affected</span>
                        )}
                        {rec.type === 'ai-powered' && rec.aiConfidence && (
                          <Chip 
                            label={`AI Confidence: ${rec.aiConfidence}`} 
                            size="small" 
                            color="success" 
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          />
                        )}
                      </MDTypography>
                    </MDBox>
                    <Chip
                      label={rec.priority}
                      color={getPriorityColor(rec.priority)}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </MDBox>
                </AccordionSummary>
                <AccordionDetails>
                  <MDBox>
                    {/* Problem Description */}
                    <MDBox mb={3}>
                      <MDTypography variant="subtitle2" fontWeight="bold" color="error.main" mb={1}>
                        🚨 Problem Identified
                      </MDTypography>
                      <MDTypography variant="body2" color="text" sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'error.main' }}>
                        {rec.problemDescription}
                      </MDTypography>
                    </MDBox>

                    {/* Detailed Analysis */}
                    <MDBox mb={3}>
                      <MDTypography variant="subtitle2" fontWeight="bold" color="info.main" mb={1}>
                        📊 Detailed Analysis
                      </MDTypography>
                      <MDTypography variant="body2" color="text" sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'info.main' }}>
                        {rec.detailedAnalysis}
                      </MDTypography>
                    </MDBox>

                    {/* Recommendation */}
                    <MDBox mb={3}>
                      <MDTypography variant="subtitle2" fontWeight="bold" color="success.main" mb={1}>
                        💡 Recommendation
                      </MDTypography>
                      <MDTypography variant="body2" color="text" sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'success.main' }}>
                        {rec.description}
                      </MDTypography>
                    </MDBox>

                    {/* Specific Actions */}
                    {rec.specificActions && rec.specificActions.length > 0 && (
                      <MDBox mb={3}>
                        <MDTypography variant="subtitle2" fontWeight="bold" color="warning.main" mb={1}>
                          ⚡ Specific Actions to Take
                        </MDTypography>
                        {Array.isArray(rec.specificActions) && rec.specificActions[0] && typeof rec.specificActions[0] === 'object' ? (
                          // New detailed action format
                          rec.specificActions.map((action, actionIndex) => (
                            <MDBox key={actionIndex} sx={{ pl: 2, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <MDTypography variant="subtitle2" fontWeight="bold" color="text" mb={0.5}>
                                {action.action}
                              </MDTypography>
                              <MDTypography variant="body2" color="text" mb={1}>
                                {action.description}
                              </MDTypography>
                              <MDBox display="flex" gap={2} flexWrap="wrap">
                                <Chip label={`Timeline: ${action.timeline}`} size="small" color="info" />
                                <Chip label={`Cost: ${action.cost}`} size="small" color="warning" />
                                <Chip label={`Implementation: ${action.implementation}`} size="small" color="success" />
                              </MDBox>
                            </MDBox>
                          ))
                        ) : (
                          // Old simple action format
                          rec.specificActions.map((action, actionIndex) => (
                            <MDTypography key={actionIndex} variant="body2" color="text" sx={{ pl: 2, mb: 0.5 }}>
                              • {action}
                            </MDTypography>
                          ))
                        )}
                      </MDBox>
                    )}




                    {/* Problem-Solution Format */}
                    {rec.problem_solution && (
                      <MDBox mb={3}>
                        <MDTypography variant="subtitle2" fontWeight="bold" color="error.main" mb={1}>
                          Problem Statement
                        </MDTypography>
                        <MDBox sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'error.main', p: 2, bgcolor: 'error.light', borderRadius: 1, mb: 2 }}>
                          <MDTypography variant="body2" color="text">
                            &ldquo;{rec.problem_solution.problem_statement}&rdquo;
                          </MDTypography>
                        </MDBox>
                        
                        <MDTypography variant="subtitle2" fontWeight="bold" color="success.main" mb={1}>
                          AI-Generated Solution
                        </MDTypography>
                        <MDBox sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'success.main', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                          <MDTypography variant="body2" color="text" mb={1}>
                            {rec.problem_solution.ai_solution}
                          </MDTypography>
                          <MDTypography variant="caption" color="text" fontWeight="medium">
                            Generated by: {rec.problem_solution.model_used}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    )}

                    <LinearProgress
                      variant="determinate"
                      value={rec.impact}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "grey.200",
                        mb: 2,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          bgcolor: `${getPriorityColor(rec.priority)}.main`,
                        },
                      }}
                    />
                  </MDBox>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </MDBox>

        {/* Footer */}
        <MDBox
          p={2}
          sx={{
            borderTop: "1px solid",
            borderColor: "grey.200",
            bgcolor: "grey.50",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <MDBox display="flex" alignItems="center" gap={1}>
            <Icon sx={{ fontSize: 16, color: "text.secondary" }}>info</Icon>
            <MDTypography variant="caption" color="text">
              Recommendations are updated based on your data analysis
            </MDTypography>
          </MDBox>
        </MDBox>
      </CardContent>
    </Card>
  );
}

// Setting default values for the props of RecommendationSystem
RecommendationSystem.defaultProps = {
  data: null,
  selectedCategory: "all",
  onRecommendationSelect: null,
};

// Typechecking props for the RecommendationSystem
RecommendationSystem.propTypes = {
  data: PropTypes.object,
  selectedCategory: PropTypes.string,
  onRecommendationSelect: PropTypes.func,
};

export default RecommendationSystem;
